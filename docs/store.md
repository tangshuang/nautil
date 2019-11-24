# Store/State

We provide a much smart and much smaller store in Nautil. We do not follow flux but follow Observer Pattern, so we give up redux, it is too heavy.

Now let's look into our Store. What is a store? A store is a container which keeps a state object and has APIs to watch and change state. State is the basic info of UI, when state changes, the UI changes. So we can use store to controll the UI with its APIs.

## Create Store

It is very very easy to create a store.

```js
import { Store } from 'nautil'

const store = new Store({
  name: 'xxx',
  age: 10,
})
```

Just initialize with `new` and pass default values to create a store.
Unlike vuejs, our store can add/remove new properties anytime.

## State

A store has a `state` property to read state.

```js
const { state } = store

const { a } = state // read
state.a = 2 // write
```

As you seen, just modify state directly, very like vuejs.

## Use APIs

However, use `state` may not make sense if you are not want to follow vuejs in react. You can use `get` `set` and `del` to operate data.

```js
const hands = store.get('body.hands')
store.set('body.hands', 2)
store.del('body.hands')
```

## Watch

To listen to the change of state, you should call `watch` on the store.

```js
store.watch('body.hands', (newVal, oldVal) => {
  store.set('body.feet', newVal)
})
```

It is very like angular's `$watch` method. It supports the third parameter `deep` to determine whether be triggered when deep value changes.

Use `unwatch` to stop listen.


## Computed Property

It supports computed property like vuejs does. When you want to define a computed property, you can pass the property as a native js computed property:

```js
const store = new Store({
  name: 'tomy',
  birth: 2009,

  // age is a absolute computed property with getter and setter
  get age() {
    return new Date().getFullYear() - this.birth
  },
  set age(age) {
    this.birth = new Date().getFullYear() - age
  },

  // height is a defective computed property which has only getter, set its value will not work
  get height() {
    return this.age * 5
  },

  // fatherAge is a defective computed property which has only setter, it will always return `undefined` when read it
  set fatherAge(fage) {
    this.age = fage - 28
  },
})
```

Another way to change some computed properties is to use `define` method on `store`.

```js
store.define('color', {
  get() {
    return this.age % 2
  },
  set(v) {
    this.age = v * 3 / 2
  },
})
```

## Tansaction Update

Like react `setState`, store has a `update` method to update data in a transaction. Mutiple updating in a short time will be merged, and if some error occurs during update, the state will be recovered to the beginning status. It returns a Promise.

```js
await store.update({
  'body.hands': 2,
  'head': 40,
})
```

## Use with Component

How to use Store with a component? In fact, there are three kinds of stores:

- application level store
- shared level store
- component level store

Example1:

```js
import { Component, Store } from 'nautil'
import { initialize, observe, pipe } from 'nautil/operators'

class SomeComponent extends Component {
  render() {
    const { store } = this.attrs
    const { state } = store
    return (
      <div>
        <button onClick={() => state.some ++}>+1</button>
        <span>{state.some}</span>
      </div>
    )
  }
}

export default pipe([
  initialize('store', Store, { some: 1 }),
  observe('store'),
])(SomeComponent)
```

We initialize a store when SomeComponent is initialized. Each instance of SomeCompoment will have a single store, this store is component level store.

Example2:

```js
// store.js
import { Store } from 'nautil'
export default const store = new Store({
  name: 'tomy',
  age: 10,
})
```

```js
// component1.js
import { Component } from 'nautil'
import { inject, observe, pipe } from 'nautil/operators'
import store from './store'

class Component1 extends Component {
  render() {
    const { store } = this.attrs
    const { state } = store
    return (
      <div>{state.name}</div>
    )
  }
}

export default pipe([
  inject('store', store),
  observe('store'),
])(Component1)
```

```js
// component2.js
import { Component } from 'nautil'
import { inject } from 'nautil/operators'
import store from './store'

class Component2 extends Component {
  render() {
    const { store } = this.attrs
    const { state } = store
    return (
      <div>{state.age}</div>
    )
  }
}

export default pipe([
  inject('store', store),
  observe('store'),
])(Component2)
```

We create a store in a single file, and use it in two different components, this store is shared by these two component.

Example3:

```js
// app.js
import { Component } from 'nautil'
import store from './store'
import { multiple, pollute } from 'nautil/operators'

import Page1 from './page1'
import Page2 from './page2'
import Page3 from './page3'

class App extends Component {
  render() {
    // ...
  },
}

export default multiple(pollute, [
  Page1,
  Page2,
  Page3,
], { store })(App)
```

```js
// page1.js
import { Component } from 'nautil'

export default class Page1 extends Component {
  render() {
    const { store } = this.attrs
    // ...
  }
}
```

We pollute store into `Page1` `Page2` and `Page3` in `App` component so that we can use the global `store` in `Page1` `Page2` or `Page3` directly.

We will learn how to use operators [here](./operators.md) latter.
