import { mixin } from 'ts-fns'
import Storage from '../../lib/storage/storage.js'

mixin(Storage, class {
  async getItem(key) {
    const value = localStorage.getItem(key)
    if (typeof value === 'string') {
      return JSON.parse(value)
    }
    else {
      return value
    }
  }
  async setItem(key, value) {
    const data = JSON.stringify(value)
    return localStorage.setItem(key, data)
  }
  async removeItem(key) {
    return localStorage.removeItem(key)
  }
  async clear() {
    return localStorage.clear()
  }
})

export { Storage }
export default Storage
