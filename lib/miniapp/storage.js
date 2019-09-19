import Storage from '../core/storage.js'

Object.assign(Storage.prototype, {
  init() {
    this.store = wx
  },
  async getItem(key) {
    return new Promise((resolve, reject) => {
      this.store.getStorage({
        key,
        success(res) {
          resolve(res.data)
        },
        fail(error) {
          reject(error)
        },
      })
    })
  },
  async setItem(key, value) {
    return new Promise((resolve, reject) => {
      this.store.setStorage({
        key,
        data: value,
        success() {
          resolve()
        },
        fail(error) {
          reject(error)
        },
      })
    })
  },
  async removeItem(key) {
    return new Promise((resolve, reject) => {
      this.store.removeStorage({
        key,
        success() {
          resolve()
        },
        fail(error) {
          reject(error)
        },
      })
    })
  },
})
