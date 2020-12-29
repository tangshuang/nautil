import { createApp } from 'nautil'
import { mount } from 'nautil/dom'
import navigation from './navigation.js'

const App = createApp({
  navigation,
})

mount('#root', App)
