import { Navigation } from 'nautil'

import Page1 from './pages/Page1.jsx'
import Page2 from './pages/Page2.jsx'
import Page3 from './pages/Page3.jsx'
import Page4 from './pages/Page4.jsx'
import Page5 from './pages/Page5.jsx'

import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'

const navigation = new Navigation({
  base: '/',
  routes: [
    {
      name: 'home',
      path: '/',
      component: Home,
    },
    {
      name: 'page1',
      path: '/page1',
      component: Page1,
    },
    {
      name: 'page2',
      path: '/page2/:id/:action?',
      component: Page2,
    },
    {
      name: 'page3',
      path: '/page3',
      component: Page3,
    },
    {
      name: 'page4',
      path: '/page4/:id?',
      component: Page4,
    },
    {
      name: 'page5',
      path: '/page5',
      component: Page5,
    },
  ],
  notFound: NotFound,
  maxHistoryLength: 20,
  defaultRoute: 'home',
})

export default navigation
