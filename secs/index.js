import { Router, Nautil } from 'nautil'

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

const app = new Nautil({
  el: '#app',
  router,
})
