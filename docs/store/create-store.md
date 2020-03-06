# Create Store

It is very very easy to create a store.

```js
import { Store } from 'nautil'

const store = new Store({
  name: 'xxx',
  age: 10,
})
```

Just initialize with `new` and pass default values to create a store.
Unlike vuejs, our store can add/remove new properties anytime.
