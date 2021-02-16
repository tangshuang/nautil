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
