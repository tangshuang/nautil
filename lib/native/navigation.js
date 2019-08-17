import Navigation from '../core/navigation.js'
import { AsyncStorage, Linking } from 'react-native'
import StorageX from 'storagex'

Object.assign(Navigation.prototype, {
  async init(options = {}) {
    this.storage = new StorageX({
      namespace: this.options.namespace || 'nautil',
      storage: AsyncStorage,
      async: true,
      stringify: true,
    })
    // onLoaded
    const state = await this.storage.get('historyState')
    if (state) {
      const { route, name, params } = state
      const { redirect } = route
      if (redirect) {
        this.go(redirect, params, true)
        return
      }
      this.go(name, params)
    }
    else if (this.options.defaultRoute) {
      const { defaultRoute } = this.options
      this.go(...(Array.isArray(defaultRoute) ? defaultRoute : [defaultRoute]))
    }
    else {
      const { routes } = this
      const defaultRoute = routes[0]
      const { name, params = {} } = defaultRoute
      this.go(name, params)
    }
  },

  async open(url, params) {
    each(params, (value, key) => {
      url = url.replace(new RegExp(':' + key + '[(?=\\\/)|$]', 'g'), value)
    })
    const supported = await Linking.canOpenURL(url)
    if (!supported) {
      throw new Error('not support open ' + url)
    }
    const res = await Linking.openURL(url)
    return res
  },

  async changeLocation(state, replace = false) {
    await this.storage.set('historyState', state)
  },
})
