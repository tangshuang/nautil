import { Router, App } from 'nautil'

const router = new Router({
  mode: 'history',
  views: [
    {
      name: 'sample',
      url: '/sample',
      component: import('./pages/sample'),
    },

    // 子路由
    // 路由匹配遵循从精确到模糊匹配的原则，所以，子路由会被先匹配和使用
    {
      name: 'child1',
      url: '/sample/child1',
      component: import('./pages/sample/layout/child1'),
    },
  ],
})
const app = new App({
  el: '#app',
  router,
})
