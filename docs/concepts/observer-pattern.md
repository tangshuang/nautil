# Observer Pattern

[Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern) is the most important concepts you should keep in mind when you use Nautil. It is so important that already all abilities are built on it.

> The observer pattern is a software design pattern in which an object, called the **subject**, maintains a list of its dependents, called **observers**, and notifies them automatically of any state changes, usually by calling one of their methods.

Normally, we create a subject and pass a function into it, this function is a method of an observer. When the subject changes, the method will be called, so that the observer will change too.

Let's look a simple example:

```js
<Observer
  dispatch={this.update}
  subscribe={dispatch => store.on('*', dispatch)}
  unsubscribe={dispatch => store.off('*', dispatch)}
>
  {store.get('some')}
</Observer>
```

In Nautil, we use `Observer` component as an *observer*, here `store` is a subject. `Observer` component receive a `dispatch` prop to define its *method*. The `subscribe` prop is the action to give the *method* to the *subject*. After `Observer` component mounted, the subscribe function will be called, so that the *subject* `store` will put the *method* `dispatch` in the dependents' notifies list. When `store` changes, `dispatch` which equals `this.update` will be called. Then the UI will be rerendered.
