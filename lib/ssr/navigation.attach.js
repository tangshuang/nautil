import Navigation from '../core/navigation.js'
import { attachPrototype } from '../core/utils.js'

attachPrototype(Navigation, {
  init() {},
  setUrl(url) {
    const { base = '/' } = this.options
    if (base !== '/') {
      url = url.replace(base, '')
    }

    const state = this.parseUrlToState(url)
    // reset history, because on server side, there is no need to keep navigation state
    this._history.length = 0
    this.push(state, false)
  },
})
