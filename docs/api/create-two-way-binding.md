# createTwoWayBinding

```js
import { createTwoWayBinding } from 'nautil'

const $data = createTwoWayBinding({}, (data, keyPath, value) => {
  assign(data, keyPath, value)
})
```