# Consumer

`Consumer` should must be used inside `Provider`.

```js
import { Consumer } from 'nautil'

function Some() {
  return (
    <Section>
      <Consumer render={store => {
        ...
      }}>
    </Section>
  )
}
```

## connect

`connect` should must be used inside `Provider`.

```js
const ConnectedComponent = connect(mapStoreToProps)(MyComponent)

<Section>
  <ConnectedComponent />
</Section>
```

## useStore

`useStore` will watch the change of store and trigger rerendering:

```js
function MyComponent() {
  useStore(store)
  ...
}
```