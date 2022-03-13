# useTwoWayBinding

```typescript
declare function useTwoWayBinding(
  // object to convert to be two-way-binding
  data: object,
  // function to invoke when two-way-binding changed
  updator: (value: any, keyPath: string[], data: object) => void,
  // whether to generate formalized two-way-binding like [value, update]
  formalized?: boolean,
): Proxy
```

```js
import { useTwoWayBinding, useForceUpdate } from 'nautil'

function Some() {
  const forceUpdate = useForceUpdate()
  const $state = useTwoWayBinding({ value: '' }, (state, key, value) => {
    state[key] = value
    forceUpdate()
  })
  return <Input $value={$state.value} />
}
```

## useTwoWayBindingAttrs(props)

```typescript
declare function useTwoWayBindingAttrs(props: object, formalized: boolean): [object, Proxy]
```

```js
function Some(props) {
  const [attrs, $attrs] = useTwoWayBindingAttrs(props)

  return <SomeModal $show={[attrs.show, show => $attrs.show = show]} />
}
```

## useTwoWayBindingState(initState)

```typescript
declare function useTwoWayBindingState(initState: object, formalized: boolean): [object, Proxy]
```

```js
function Some(props) {
  const [state, $state] = useTwoWayBindingState({ show: false })

  return <SomeModal $show={[state.show, show => $state.show = show]} />
}
```
