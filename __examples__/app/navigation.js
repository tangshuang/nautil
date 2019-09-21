import { Navigation } from 'nautil'

import Page1 from './pages/Page1.jsx'
import Page2 from './pages/Page2.jsx'
import Page3 from './pages/Page3.jsx'
import Page4 from './pages/Page4.jsx'
import Page5 from './pages/Page5.jsx'
import Page6 from './pages/Page6.jsx'
import { Page7, Child } from './pages/Page7.jsx'

import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'

const navigation = new Navigation({
  base: '/',
  mode: 'hash',
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
    {
      name: 'page6',
      path: '/page6',
      component: Page6,
    },
    {
      name: 'page7',
      path: '/page7',
      component: Page7,
      children: [
        {
          name: 'child',
          path: '/child',
          children: [
            {
              name: 'subchild',
              path: '/subchild',
            },
            {
              name: 'subchild2',
              path: '/subchild2',
              component: () => 'subchild2',
            },
          ],
        },
        {
          name: 'child1',
          path: '/child1',
        },
        {
          name: 'child2',
          path: '/child2',
        },
      ],
    },
  ],
  notFoundComponent: NotFound,
  maxHistoryLength: 20,
  defaultRoute: 'home',
})

export default navigation
