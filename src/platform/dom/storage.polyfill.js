import Storage from '../core/storage.js'
import StorageX from 'storagex'
import { attachStatic } from '../utils.js'

const store = new StorageX({
  storage: localStorage,
  async: true,
  stringify: true,
})

attachStatic(Storage, {
  async getItem(key) {
    return await store.get(key)
  },
  async setItem(key, value) {
    await store.set(key, value)
  },
  async removeItem(key) {
    await store.remove(key)
  },
  async clear() {
    await store.clear()
  },
})
