# Reactive Mutable Data

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
