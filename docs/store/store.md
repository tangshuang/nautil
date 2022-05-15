# Store

```js
import { Store } from 'nautil'

const store = new Store({ ... })
```

## API

### subscribe(fn)

```js
store.subscribe((next, prev) => ...)
```

### unsubscribe(fn)

```js
const fn = () => {}
store.subscribe(fn)
...
store.unsubscribe(fn)
```

### getState()

```js
const state = store.getState()
```

```js
const { state } = store
```

```js
const $state = store.$state
$state.age ++ // -> store.update(state => state.age ++)
```

### resetState()

Restore initialize state as current state.

### setState(state)

Merge given `state` into current state.

### update(updator)

```js
store.update(state => {
  // use mutable action like vue.js
  state.body.hand = ...
  state.next.some = ...
})
```

### initState()

```js
class MyStore extends Store {
  initState() {
    return {
      name: 'tomy',
      age: 10,
    }
  }
}

const store = new MyStore()
store.$state.age ++

store.state.age === 11
```

## Provider

```js
import { Store, Provider } from 'nautil'

const store = new Store(...)

<Provider store={store}>
  <App />
</Provider>
```

## Consumer

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
const ConnectedComponent = connect(mapStoreToProps, watch)(MyComponent)

<Section>
  <ConnectedComponent />
</Section>
```

`watch` is an string array, which provides keys to check whether changed. Use it when you want higher performance. For exmaple:

```js
const store = new Store({
  a: 1,
  b: 2,
  c: 3,
})

// -------------------

const SomeComponent = connect(mapStoreToProps, ['a', 'b'])(C)
```

## useStore

`useStore` will watch the change of store and trigger rerendering:

```js
function MyComponent() {
  const store = useStore()
  ...
}
```

```
const store = useStore(watch?)
```

`watch` is the same as `connect`.

## applyStore

Apply a local shared store with hooks function usage.

```js
const store = new Store()
const { useStore, connect } = applyStore(store)

function MyComponent() {
  const { getState, setState, update } = useStore()
  const state = getState()

  // ....

  setState({ some: 111 })

  update(state => {
    state.some = 222
  })
}

const SomeComponent = connect(mapStoreToProps)(OtherComponent)
```

Use `useStore` amoung different components.
