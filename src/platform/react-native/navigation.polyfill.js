import Navigation from '../core/navigation.js'
import { Linking } from 'react-native'
import { attachPrototype } from '../utils.js'

attachPrototype(Navigation, {
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
  },
})
