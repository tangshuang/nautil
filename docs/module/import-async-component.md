# importAsyncComponent

```js
import { importAsyncComponent } from 'nautil'

const Home = importAsyncComponent({
  source: () => import('./home.jsx'),
  pending: (props) => null,
  prefetch: (props) => [
    `/api/detail/${props.id}`,
  ],
})
```

- source: async function which returns a Promise that resolve a ReactComponent
- pending: display before source Promise resolved
- prefetch: prefetch data from server side during source Promise pending/loading component file

When source Promise resolves a ESModule (`[Symbol.toStringTag] === 'Module'`) it will use `default` export as component. For example:

```js
// home.jsx
export default function Home(props) {
  // ...
}
```

It will use `Home` as source.