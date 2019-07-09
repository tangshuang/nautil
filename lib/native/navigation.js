import Navigation from '../core/navigation.js'
import { AsyncStorage } from 'react-native'
import StorageX from 'storagex'

const storage = new StorageX({
  namespace: 'nautil',
  storage: AsyncStorage,
  async: true,
  stringify: true,
})

Object.assign(Navigation.prototype, {
  async init(options) {
    // onLoaded
    const state = await storage.get('historyState')
    if (state) {
      const { route, params } = state
      const { redirect } = route
      if (redirect) {
        this.go(redirect, params, true)
        return
      }
      this.push(state)
    }
    else if (options.defaultIndex) {
      this.go(options.defaultIndex)
    }
  },

  open(url, params) {},

  async changeLocation(state, replace = false) {
    await storage.set('historyState', state)
  },
})
