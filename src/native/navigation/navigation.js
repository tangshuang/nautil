import { mixin } from 'ts-fns'
import { Linking } from 'react-native'
import { Navigation } from '../../lib/navigation/navigation.js'
import { Storage } from '../../lib/storage/storage.js'

mixin(Navigation, class {
  mapMode(info) {
    const { mode = '' } = info

    if (mode !== 'storage') {
      return { ...info, mode: 'memo', query: '' }
    }

    return info
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
})

export { Navigation }
export default Navigation
