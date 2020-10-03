import { Navigation } from '../../src/index.js'
import Home from './modules/home/home.jsx'

const navigation = new Navigation({
  routes: [
    {
      name: 'home',
      path: '/home',
      component: Home,
    },
  ],
})

export default navigation
