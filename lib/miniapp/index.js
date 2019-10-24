import './plyfills.js'
import './storage.js'
import './navigation.js'
import './depository.js'

import '../dom/style.js'
import '../dom/components.js'
import '../dom/mobile-components.js'

import { mount } from '../dom/index.js'

export function createApp(Component, props) {
  return function() {
    const container = document.createElement('div')
    container.id = 'app'
    document.body.appendChild(container)

    mount('#app', Component, props)
  }
}
