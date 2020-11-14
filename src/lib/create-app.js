import Navigator from './navi/navigator.jsx'
import Provider from './store/provider.jsx'
import Language from './i18n/language.jsx'

import { nest } from './core/operators/operators.js'

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
  if (navigation) {
    items.push([Navigator, { navigation, inside: true }])
  }

  if (fn) {
    fn(items, options)
  }

  const Component = nest(...items)(None)

  return Component
}
