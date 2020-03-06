# Observable Object

Observable Object is a kind of object whose changing can be watched. There are many ways to create an observable object, such as computed property, rxjs Observable.create, mobx Observable and so on.

In Nautil, internal objects, Navigation, Store, Model, Depository and I18n, are all observable objects.

The usage is to work with Observer Pattern. As what I do in previous code section, we can use observable objects with `Observer` component or `observe` operator to make a reactive system.

```js
const depo = new Depository(options)
const WrappedComponent = observe(
  dispatch => depo.subscribe('some', dispatch),
  dispatch => depo.unsubscribe('some', dispatch)
)(MyComponent)
```

As the code shown, `WrappedComponent` will automaticly update when `some` of `depo` changes.
