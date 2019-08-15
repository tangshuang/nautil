import { mount } from 'nautil/dom'
import App from '../app/App.jsx'
import axios from 'axios'
import depo from '../app/depo.js'

export default function crreateApp() {
  const { headers, timeout } = depo.options
  depo.axios = axios.create({
    baseURL: 'http://localhost:8085',
    headers, timeout,
  })

  const container = document.createElement('div')
  container.id = 'app'
  document.body.appendChild(container)

  mount('#app', App)
}
