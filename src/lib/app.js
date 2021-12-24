import Navigator from './navigation/navigator.jsx'
import Provider from './store/provider.jsx'
import Language from './i18n/language.jsx'
import { nest } from './operators/operators.js'
import { Ty } from 'tyshemo'
import Navigation from './navigation/navigation.js'
import { Component } from './component.js'

export function createApp(options = {}, fn) {
  const { navigation, store, i18n } = options
  const None = () => null

  const items = []

  if (store) {
    items.push([Provider, { store }])
  }
  if (i18n) {
    items.push([Language, { i18n }])
  }

  if (process.env.NODE_ENV !== 'production') {
    Ty.expect(navigation).to.be(Navigation)
  }

  items.push([Navigator, { navigation, inside: true }])

  if (fn) {
    fn(items, options)
  }

  const Component = nest(...items)(None)
  return Component
}

export function createAsyncComponent(fn) {
  return class extends Component {
    component = null
    onMounted() {
      fn().then((res) => {
        let component = null
        if (res && res[Symbol.toStringTag] === 'Module') {
          component = res.default
        }
        else {
          component = res
        }

        this.component = component
        this.update()
      })
    }
    render() {
      if (!this.component) {
        return null
      }

      const C = this.component
      return <C {...this.props} />
    }
  }
}

export function importModule(options) {
  const { prefetch, source, pending } = options

  let loadedComponent = null

  class ModuleComponent extends Component {
    state = {
      component: loadedComponent,
    }

    prefetchLinks = []

    componentDidMount() {
      if (!loadedComponent) {
        // 拉取组件
        source(this.props)
          .then((mod) => {
            if (mod[Symbol.toStringTag] === 'Module') {
              return mod.default
            }
            return mod
          })
          .then((component) => {
            if (typeof component === 'function') {
              this.setState({ component })
            }
            loadedComponent = component
          })
        // 预加载
        if (prefetch) {
          const urls = prefetch(this.props)
          urls.forEach((url) => {
            const link = document.createElement('link')
            link.rel = 'prefetch'
            link.as = 'fetch'
            link.href = url
            document.head.appendChild(link)
            this.prefetchLinks.push(link)
          })
        }
      }
    }

    componentWillUnmount() {
      if (this.prefetchLinks.length) {
        this.prefetchLinks.forEach((link) => {
          document.head.removeChild(link)
        })
      }
    }

    render() {
      if (!this.state.component && !pending) {
        return null
      }

      if (!this.state.component && pending) {
        return pending(this.props)
      }

      const LoadedComponent = this.state.component

      return <LoadedComponent {...this.props} />
    }
  }

  return ModuleComponent
}
