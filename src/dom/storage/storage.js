import { mixin } from 'ts-fns'
import Storage from '../../lib/storage/storage.js'

mixin(Storage, class {
  async getItem(key) {
    return localStorage.getItem(key)
  }
  async setItem(key, value) {
    return localStorage.setItem(key, value)
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
