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
    this.options = { ...Navigation.defualtOptions, ...options }
    this.routes = options.routes

    this.status = ''
    this.state = {}

    this._listeners = []
    this._history = []

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
  },

  open(url, params) {
    // todo
  },

  async changeLocation(state, replace = false) {
    await storage.set('historyState', state)
  },
})
