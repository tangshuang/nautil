# Use with Component

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
