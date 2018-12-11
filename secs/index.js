import { Router, Render } from 'nautil'

const router = new Router({
  mode: 'history',
  views: [
    {
      name: 'sample',
      url: '/sample',
      component: import('./pages/sample'),
    },
  ],
})

const app = new Render({
  el: '#app',
  router,
})

