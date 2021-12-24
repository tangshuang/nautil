import { mixin } from 'ts-fns'
import { Linking } from 'react-native'
import { Navigation } from '../../lib/navigation/navigation.js'
import { Storage } from '../../lib/storage/storage.js'

mixin(Navigation, class {
  _getMode() {
    const { mode = '' } = this.options

    if (!mode) {
      return { mode: 'memo', query: '', base: '' }
    }

    return { mode: 'storage', query: '', base: '' }
  }

  async open(to, params) {
    const url = this.makeUrl(to, params)
    const supported = await Linking.canOpenURL(url)
    if (!supported) {
      throw new Error('not support open ' + url)
    }
    const res = await Linking.openURL(url)
    return res
  }

  async changeLocation(nextState, replace = false) {
    const { mode } = this._getMode()
    if (mode === 'storage') {
      await Storage.setItem('historyState', nextState)
    }
  }
})

export { Navigation }
export default Navigation
