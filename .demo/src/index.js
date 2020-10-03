import { createApp, mount } from '../../src/dom/index.js'

import store from './store.js'
import navigation from './navigation.js'

const App = createApp({
  navigation,
  store,
})

mount('#root', App)
