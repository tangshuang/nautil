# State

A store has a `state` property to read state.

```js
const { state } = store

const { a } = state // read
state.a = 2 // write
```

As you seen, just modify state directly, very like vuejs.
