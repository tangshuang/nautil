import { mixin } from 'ts-fns'
import { Linking } from 'react-native'
import Navigation from '../../lib/navi/navigation.js'

mixin(Navigation, class {
  async open(url, params) {
    each(params, (value, key) => {
      url = url.replace(new RegExp(':' + key + '[(?=\\\/)|$]', 'g'), value)
    })
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
