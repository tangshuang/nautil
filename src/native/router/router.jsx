import { mixin } from 'ts-fns'
import { Linking, TouchableOpacity } from 'react-native'
import { Router } from '../../lib/router/router.jsx'

mixin(Router, class {
  $createLink(data) {
    const { children, href, open, navigate, ...attrs } = data
    const handleClick = async () => {
      if (open) {
        const supported = await Linking.canOpenURL(href)
        if (!supported) {
          throw new Error('not support open ' + href)
        }
        await Linking.openURL(href)
      }
      else {
        navigate()
      }
    }
    return (
      <TouchableOpacity {...attrs} onPress={handleClick}>{children}</TouchableOpacity>
    )
  }
})

export { Router }
export default Router