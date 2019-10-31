import { mount } from '../dom/dom.js'

export function createApp(Component, props) {
  return function() {
    const container = document.createElement('div')
    container.id = 'app'
    document.body.appendChild(container)

    mount('#app', Component, props)
  }
}
