import Navigator from './navi/navigator.jsx'
import Provider from './store/provider.jsx'
import Language from './i18n/language.jsx'
import { nest } from './operators/operators.js'
import { Ty } from 'tyshemo'
import Navigation from './navi/navigation.js'
import { Component } from './component.js'
import { isFunction, isInstanceOf } from 'ts-fns'
import { Component as ReactComponent } from 'react'

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

        if (!isFunction(res) && !isInstanceOf(res, ReactComponent)) {
          throw new Error('createAsyncComponent did not receive a valid component')
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