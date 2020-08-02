let store = {}
export const StorageService = {
  async getItem(key) {
    return store[key]
  },
  async setItem(key, value) {
    store[key] = value
  },
  async removeItem(key) {
    delete store[key]
  },
  async clear() {
    store = {}
  },
}
export default StorageService
