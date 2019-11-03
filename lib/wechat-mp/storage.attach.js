import Storage from '../core/storage.js'
import { attachStatic } from '../core/utils.js'

attachStatic(Storage, {
  async getItem(key) {
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
  async clear() {
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
  },
})
