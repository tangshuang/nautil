import { mount } from 'nautil/dom'
import App from '../app/App.jsx'
import navigation from '../app/navigation.js'

navigation.setOption('mode', 'history')
mount('#app', App)
