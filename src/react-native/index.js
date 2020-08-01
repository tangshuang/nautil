import './polyfills.js'

import { AppRegistry, YellowBox } from 'react-native'

// remove no use warning
YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader',
])

export function registerConfig(config) {
  AppRegistry.registerConfig(config)
}

export function register(name, Component) {
  AppRegistry.registerComponent(name, () => Component)
}
