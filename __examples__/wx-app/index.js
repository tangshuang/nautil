import { mount } from 'nautil/miniapp'
import App from '../app/App.jsx'

export default function crreateApp() {
  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  mount('#app', App)
}
