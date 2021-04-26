import { Navigation } from 'nautil'
import Home from './modules/home/home.jsx'
import Hot from './modules/hot/hot.jsx'

const navigation = new Navigation({
  mode: 'history',
  routes: [
    {
      name: 'home',
      path: '/home',
      component: Home,
    },
    {
      name: 'hot',
      path: '/hot',
      component: Hot,
    },
  ],
})

export default navigation
