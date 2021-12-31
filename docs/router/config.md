# Router Config

```js
import { Router } from 'nautil'

const { Outlet } = new Router(config)

export function Some() {
  return (
    <div>
      <header>header</header>
      <Outlet />
    </div>
  )
}
```

Config:

- routes: Array
  - path: string
  - component: ReactComponentType

`path` should be relative to current router context, for example `a/b` `some`, notice without `/` or `./` at the beginning.

```js
import { createAsyncComponent } from 'nautil'

const Home = createAsyncComponent(() => import('./home.jsx'))
const Detail = createAsyncComponent(() => import('./detail.jsx'))

const router = new Router({
  routes: [
    {
      // empty string make this route only works when the url is equal current context
      path: '',
      component: Home,
    },
    {
      // id will be passed into Detail as a prop
      path: 'detail/:id',
      component: Detail,
    },
  ],
})
```