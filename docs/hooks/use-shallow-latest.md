# useShallowLatest

```
const latest = useShallowLatest(obj)
```

Get the latest shallow equal object. i.e.

```js
const a = { test: 1 }
const latest = useShallowLatest(a) // -> latest === a

const b = { test: 1 }
const latest2 = useShallowLatest(b) // -> latest2 === a !== b
```