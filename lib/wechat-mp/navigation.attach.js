import Navigation from '../core/navigation.js'
import { attachPrototype } from '../core/utils.js'

attachPrototype(Navigation.prototype, {
  async open(url, params) {},
})
