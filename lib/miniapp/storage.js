import Storage from '../core/storage.js'

Object.assign(Storage, {
  async getItem(key) {
    return new Promise((resolve, reject) => {
      wx.getStorage({
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
      wx.setStorage({
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
      wx.removeStorage({
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

export { Storage }
export default Storage
