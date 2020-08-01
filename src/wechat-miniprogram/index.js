import './polyfills.js'

import { mount } from '../dom/index.js'

export function createApp(Component, props) {
  return function() {
    const container = document.createElement('div')
    container.id = 'app'
    document.body.appendChild(container)

    mount('#app', Component, props)
  }
}
