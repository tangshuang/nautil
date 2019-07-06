import { AppRegistry } from 'react-native'
import { YellowBox } from 'react-native'

// remove no use warning
YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader',
])

export function register(name, Component) {
  AppRegistry.registerComponent(name, () => Component)
}
