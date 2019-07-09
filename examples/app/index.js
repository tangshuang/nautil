import { App } from 'nautil/dom'
import { Navigation } from 'nautil'

import NotFound from './pages/NotFound.jsx'
import Page1 from './pages/Page1.jsx'
import Page2 from './pages/Page2.jsx'

const navigation = new Navigation({
  mode: 'history',
  routes: [
    {
      name: 'page1',
      path: '/page1',
      component: Page1,
    },
    {
      name: 'page2',
      path: '/page2/:id',
      component: Page2,
    },
  ],
  notFound: NotFound,
})

const app = new App({
  navigation,
  el: '#app',
})

app.start()
