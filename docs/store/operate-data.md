# Use APIs

However, use `state` may not make sense if you are not want to follow vuejs in react. You can use `get` `set` and `del` to operate data.

```js
const hands = store.get('body.hands')
store.set('body.hands', 2)
store.del('body.hands')
```

**Tansaction Update**

Like react `setState`, store has a `update` method to update data in a transaction. Mutiple updating in a short time will be merged, and if some error occurs during update, the state will be recovered to the beginning status. It returns a Promise.

```js
await store.update({
  'body.hands': 2,
  'head': 40,
})
```
