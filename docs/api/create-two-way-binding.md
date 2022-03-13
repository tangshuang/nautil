# createTwoWayBinding

```typescript
declare function createTwoWayBinding(
  // object to convert to be two-way-binding
  data: object,
  // function to invoke when two-way-binding changed
  updator: (value: any, keyPath: string[], data: object) => void,
  // whether to generate formalized two-way-binding like [value, update]
  formalized?: boolean,
): Proxy
```


```js
import { createTwoWayBinding, Component } from 'nautil'

const $state = createTwoWayBinding(
  // data
  { show: false },
  // updator
  (value, keyPath, data) => {
    assign(data, keyPath, value)
  },
  // formalized
  true,
)

// $state.show -> [false, (value, key) => data[key] = value]

<Some $show={$state.show} />
```
