# createAsyncComponent

```js
import { createAsyncComponent } from 'nautil'

const Home = createAsyncComponent(() => import('./home.jsx'))
const Detail = createAsyncComponent(() => import('./detail.jsx'))

const AsyncComponent = createAsyncComponent(() => new Promise((resolve) => {
  setTimeout(() => {
    function AsyncComponent(props) {
      // ...
    }
    resolve(AsyncComponent)
  }, 2000)
}))
```

It is a simple version of `importAsyncComponent`.
