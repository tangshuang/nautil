let store = {}
export class Storage {
  static async getItem(key) {
    return store[key]
  }
  static async setItem(key, value) {
    store[key] = value
  }
  static async delItem(key) {
    delete store[key]
  }
  static async clear() {
    store = {}
  }
}
export default Storage
