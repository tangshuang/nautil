import { AppRegistry, LogBox } from 'react-native'

// remove no use warning
LogBox.ignoreLogs([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader',
])

export function registerConfig(config) {
  AppRegistry.registerConfig(config)
}

export function register(name, Component) {
  AppRegistry.registerComponent(name, () => Component)
}
