import Navigator from './navigation/navigator.jsx'
import Provider from './store/provider.jsx'
import Language from './i18n/language.jsx'
import { nest } from './operators/operators.js'
import { Ty } from 'tyshemo'
import Navigation from './navigation/navigation.js'
import { Component } from './component.js'
import { createContext, useContext } from 'react'
import { Provider as RouterProvider } from './router/context.js'
import { Provider as I18nProvider } from './i18n/context.js'

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

const bootstrapperContext = createContext()

export function createBootstrap(options) {
  const { router, i18n } = options
  return function(C) {
    return function Bootstrapper(props) {
      const ctx = useContext(bootstrapperContext)

      if (ctx) {
        throw new Error('You should must use createBootstrap for your root application component.')
      }

      const { Provider } = bootstrapperContext
      return (
        <Provider value={true}>
          <RouterProvider value={router}>
            <I18nProvider value={i18n}>
              <C {...props} />
            </I18nProvider>
          </RouterProvider>
        </Provider>
      )
    }
  }
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
