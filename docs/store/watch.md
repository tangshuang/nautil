# Watch

To listen to the change of state, you should call `watch` on the store.

```js
store.watch('body.hands', (newVal, oldVal) => {
  store.set('body.feet', newVal)
})
```

It is very like angular's `$watch` method. It supports the third parameter `deep` to determine whether be triggered when deep value changes.

Use `unwatch` to stop listen.
