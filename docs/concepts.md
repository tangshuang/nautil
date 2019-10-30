# Concepts

When you are going to use Nautil to write an application, I hope you know what it is, and the things which you should know before your action.

As a framework, you should know the core concepts of Nautil, so that you can catch the main idea when you are developing with it.

## Observer Pattern

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

## Two Way Binding

There is no strict defination of **Two Way Binding**. In short, it is about a reactive proposal between view and model, which describes [when changing model changes the view and changing the view changes the model](https://medium.com/front-end-weekly/what-is-2-way-data-binding-44dd8082e48e).

In react, data only goes one way, from parent component to child component by passing props. And the main vioce in its community is immutable data. However, it is not comfortable when we are going to build a intertwined application. In fact, redux is not good enough to solve the problem, it is to complex to write many non-business codes. We want an easy way.

In Nautil, we can use Two Way Binding. Let's have a look:

```js
const $some = useState(some)
<Input $value={some} />
```

The previous code is very simple, however it is very powerful. You do not need to care about what it will do inside `Input`. It will give you right UI response when value of input changed. In the document of Two Way Binding, I will introduce the whole face of it.

## Observable Object

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

## Reactive Mutable Data

The developing experience of vue.js is excellent, because it provides a Reactive Mutable Data pattern which called [reactivity system](https://vuejs.org/v2/guide/instance.html#Data-and-Methods). However, this does not match the main vioce of react community, but we can use it in Nautil by using Store and Model.

```js
import { Component, Store } from 'nautil'
import { initialize, observe, inject, pipe } from 'nautil/operators'

class SomeComponent extends Component {
  render() {
    const { state } = this.attrs
    return (
      <Button onHint={() => state.age ++}>age</Button>
    )
  }
}

export default pipe([
  initialize('store', Store, { age: 10 }),
  observe('store'),
  inject('state', props => props.store.state)
])(SomeComponent)
```

In the previous code section, I invoked `state.age ++` in the `onHint` handler, and the UI rerendering will be triggered after this sentence run. This is finished by comprehensive effect of Observer Pattern and Observable Object.

## Data Type System

To check type and structure of a data, Nautil uses [tyshemo](https://github.com/tangshuang/tyshemo#concepts). You can give a `props` static property to a class component so that props will be checked.

```js
import BookType from '../types/book.type.js'

class MyComponent extends Component {
  static props = {
    data: {
      name: String,
      age: Number,
      books: [BookType],
    },
  }
}
```

As you seen, it is very similar to real data structure, other developers can understand your props structure easily.

## CSS Module

You'd better use [CSS Module](https://css-tricks.com/css-modules-part-1-need/) in Nautil. According to the [repo](https://github.com/css-modules/css-modules), CSS modules are:

> CSS files in which all class names and animation names are scoped locally by default.

Why should you use CSS Module in Nautil? It is much easier to find out from which css file the rules come. Another reason is becuase of cross-platform. It is very easy to load css rules as objects by using building tools, if you do not use CSS Module, there is no way to cross platform with one code.

## Stream

[Rxjs](https://github.com/ReactiveX/RxJS) is used in Nautil to handle event streams. But what is a stream? A stream is data points separated by time. Read [this article](https://javascript.tutorialhorizon.com/2017/04/28/rxjs-tutorial-getting-started-with-rxjs-and-streams/) to know what and [this page](https://rxjs.dev/guide/operators) to know how.

When you handle an event, you can pass a callback function, or, the deep usage, a stream pipe-chain and execution.

```
[operator1, operator2, ...operators, execution]
```

```js
import { map } from 'nautil/stream'

<Input
  value={state.value}
  onChange={[
    // pipe chain
    map(e => e.target.value),
    map(value => value ++),

    // execution
    value => console.log(value)
  ]}
/>
```

If you pass an array, the last item should must be a function which pass into `stream$.subscribe`.

And in a custom component, you will receive the registered stream by like `this.onHint$`, and you can subscribe to this stream too.

```js
onDigest() {
  this.onHint$.subscribe(value => console.log(value))
}
```

By supporting this pattern, you will be able to seperate your event stream from UX handlers.
