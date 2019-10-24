import './style.js'
import './navigation.js'
import './storage.js'
import './components.js'

import { AppRegistry } from 'react-native'
import { YellowBox } from 'react-native'

// remove no use warning
YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader',
])

export function setConfig(config) {
  AppRegistry.registerConfig(config)
}

export function register(name, Component) {
  AppRegistry.registerComponent(name, () => Component)
}
