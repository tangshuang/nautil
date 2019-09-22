const store = {}
export const Storage = {
  async getItem(key) {
    return store[key]
  },
  async setItem(key, value) {
    store[key] = value
  },
  async removeItem(key) {
    delete store[key]
  },
}
export default Storage
