import Storage from '../core/storage.js'
import StorageX from 'storagex'

const store = new StorageX({
  storage: localStorage,
  async: true,
  stringify: true,
})

Object.assign(Storage, {
  async getItem(key) {
    return await store.get(key)
  },
  async setItem(key, value) {
    await store.set(key, value)
  },
  async removeItem(key) {
    await store.remove(key)
  },
})
