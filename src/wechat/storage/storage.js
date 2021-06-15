import { mixin } from 'ts-fns'
import Storage from '../../lib/storage/storage.js'

mixin(Storage, class {
  static async getItem(key) {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key,
        success(res) {
          resolve(res.data)
        },
        fail(error) {
          resolve()
        },
      })
    })
  }
  static async setItem(key, value) {
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
  }
  static async removeItem(key) {
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
  }
  static async clear() {
    return new Promise((resolve, reject) => {
      wx.clearStorage({
        success() {
          resolve()
        },
        fail(error) {
          reject(error)
        },
      })
    })
  }
})

export { Storage }
export default Storage
