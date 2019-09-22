import Storage from '../core/storage.js'

Object.assign(Storage, {
  async getItem(key) {
    return localStorage.getItem(key)
  },
  async setItem(key, value) {
    localStorage.setItem(key, value)
  },
  async removeItem(key) {
    localStorage.removeItem(key)
  },
})

export { Storage }
export default Storage
