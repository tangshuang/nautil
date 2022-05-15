# nest

```js
import { nest } from 'nautil'

const WrappedComponent = nest([
  [Provider, { store }],
  [Language, { i18n }],
])(OriginalComponent)
```

=> output:

```js
<Provider store={store}>
  <Language i18n={i18n}>
    <OriginalComponent {...}>
  </Language>
</Provider>
```

- options:
  - Component
  - props: object or function to return object

```js
import { nest } from 'nautil'

const WrappedComponent = nest([
  [Provider, (props) => ({ store })],
  [Language, (props) => ({ i18n })],
])(OriginalComponent)
```
