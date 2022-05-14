# Observer

This component is very important in Nautil.
It is the power to make observer pattern work in your application.

**props**

- subscribe
- unsubscribe
- dispatch
- render|children function

```js
<Observer
  subscribe={dispatch => store.subscribe(dispatch)}
  unsubscribe={dispatch => store.unsubscribe(dispatch)}
  dispatch={this.update}
>
  {() => <Text>{store.state.some}</Text>}
</Observer>
```

Notice the `dispatch` function which passed into `subscribe`/`unsubscribe` prop. In fact, it is really the function you passed into `dispatch` prop.
