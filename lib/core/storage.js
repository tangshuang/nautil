export class Storage {
  constructor() {
    this.init()
  }
  init() {
    this.store = {}
  }
  async getItem(key) {
    return this.store[key]
  }
  async setItem(key, value) {
    this.store[key] = value
  }
  async removeItem(key) {
    delete this.store[key]
  }
}
export default Storage
