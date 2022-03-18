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
$state.age ++ // -> store.dispatch(state => state.age ++)
```

### resetState()

Restore initialize state as current state.

### setState(state)

Merge given `state` into current state.

### dispatch(update)

```js
store.dispatch(state => {
  // use mutable action like vue.js
  state.body.hand = ...
  state.next.some = ...
})
```

## applyStore

Apply a shared store with hooks function usage.

```js
const store = new Store()
const { useStore, connect } = applyStore(store)

function MyComponent() {
  const { getState, setState, dispatch } = useStore()
  const state = getState()

  // ....

  setState({ some: 111 })

  dispatch(state => {
    state.some = 222
  })
}
```

Use `useStore` amoung different components.

## static initState()

```js
class MyStore extends Store {
  static initState() {
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
