import Storage from '../core/storage.js'

Object.assign(Storage.prototype, {
  init() {
    this.store = localStorage
  },
  async getItem(key) {
    return this.store.getItem(key)
  },
  async setItem(key, value) {
    this.store.setItem(key, value)
  },
  async removeItem(key) {
    this.store.removeItem(key)
  },
})

export { Storage }
export default Storage
