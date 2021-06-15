import { mixin } from 'ts-fns'
import { Linking } from 'react-native'
import Navigation from '../../lib/navi/navigation.js'

mixin(Navigation, class {
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
