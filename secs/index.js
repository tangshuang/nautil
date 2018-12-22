import { Router, Nautil } from 'nautil'

const router = new Router({
  mode: 'history',
  views: [
    {
      name: 'sample',
      url: '/sample',
      component: import('./pages/sample'),

      // 在页面中使用区域路由
      views: [
        {
          // 区域路由的名字
          // 使用方法：<View name="area1"></View>
          name: 'area1',

          // 区域路由的子url，它被拼接在当前父路由url后面
          // '/sample/area1'
          // 如果存在另外一个路由形成相同的url，两者并不冲突，根据组件内实际逻辑展示界面
          url: '/area1',

          // 在name和url都对上的情况下，使用哪个组件进行渲染
          component: import('./pages/sample/layout/area1'),
        },
      ],
    },
  ],

  // 默认展示哪个view
  defaultView: 'sample',
})
const app = new Nautil({
  el: '#app',
  router,
})

// 或者：
// router甚至可以在组件内部声明，组件内的声明跟组件内使用View相关
// 没有路由（路由在组件内部声明）：
const app2 = new Nautil({
  el: '#app',
  component: import('./pages/sample'),
})
