# useModelsReactor

```
const res = useModelsReactor(models: Model[], compute: Function, ...args)
```

Compute something which may use one of models, if the models has no change, the res will not change at the second time.

```js
const total = useModelsRector([model], () => {
  return model.price * model.count
})
```

In the previous code block, `model` should must be an instance of [Model](https://tyshemo.js.org/#/model). `total` will change only when model.price or model.count change.