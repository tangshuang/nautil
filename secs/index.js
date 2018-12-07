import { Router, Render } from 'nautil'

const route = new Router({
  mode: 'history',
  views: [
    {
      name: 'sample',
      url: '/sample',
      controller: import('./pages/sample/controller'),
      model: import('./pages/sample/model'),
      template: import('./pages/sample/view.html'),
      preload: import('./pages/loading.html'),
      stylesheet: import('./pages/sample/style.scss'),
    }
  ],
})
const SomeComponent = import('./components/box/index')
const app = new Render('#app')
app.route(route)
app.component(SomeComponent)
