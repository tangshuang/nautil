import { AsyncStorage } from 'react-native'
import Storage from '../core/storage.js'

Object.assign(Storage.prototype, {
  init() {
    this.store = AsyncStorage
  },
  async getItem(key) {
    return await this.store.getItem(key)
  },
  async setItem(key, value) {
    await this.store.setItem(key, value)
  },
  async removeItem(key) {
    await this.store.removeItem(key)
  },
})
