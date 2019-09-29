import { mount } from '../dom/nautil.js'

export function createApp(Component, props) {
  return function() {
    const container = document.createElement('div')
    container.id = 'app'
    document.body.appendChild(container)

    mount('#app', Component, props)
  }
}
