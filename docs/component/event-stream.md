# Event Stream

We pass event handlers like in react. However, in Nautil Class Components, you can use rxjs stream to handle events when you pass an array.

```js
<Input onChange={[
  // observable pipe
  map(e => e.target.value),
  map(value => +value),
  // subscribe
  value => this.setState({ value }),
]} />
```

Notice: onChange will not affect the reflect value of two-way-binding.

Inside the component, we will get `this.onChange$` which is a rxjs observable.

We will talk about this in [this paper](stream.md) later.
