import { mixin } from 'ts-fns'
import AsyncStorage from '@react-native-community/async-storage'
import Storage from '../../lib/storage/storage.js'

mixin(Storage, class {
  static async getItem(key) {
    return await AsyncStorage.getItem(key)
  }
  static async setItem(key, value) {
    await AsyncStorage.setItem(key, value)
  }
  static async removeItem(key) {
    await AsyncStorage.removeItem(key)
  }
  static async clear() {
    await AsyncStorage.clear()
  }
})

export { Storage }
export default Storage
