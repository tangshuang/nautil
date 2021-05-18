import Navigator from './navi/navigator.jsx'
import Provider from './store/provider.jsx'
import Language from './i18n/language.jsx'
import { nest } from './operators/operators.js'
import { Ty } from 'tyshemo'
import Navigation from './navi/navigation.js'
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
      fn().then(component => {
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