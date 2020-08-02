# Two-Way-Binding

In nautil.js we can use two-way-binding props. The props which begin with `$` are two-way-binding props.

To know more, we should follow:

**Two-Way-Binding only works on nautil class components.**

React primitive components and functional components do not support two-way-binding.

```js
import { Component } from 'nautil'

export default class MyComponent extends Component {
  static props = {
    $show: Boolean,
  }

  render() {
    const { show } = this.attrs
    return (
      <>
        <button onClick={() => this.attrs.show = !show}>toggle</button>
        <div stylesheet={{ display: show ? 'block' : 'none' }}>xxx</div>
      </>
    )
  }
}
```

Now, `MyComponent` will have a tow-way-binding prop `$show`, you can use it like this:

```js
function WrapperComponent() {
  const $show = useState(false)
  return <MyComponent $show={$show} />
}
```

Nautil builtin components `Input` `Textarea` `Select` support tow-way-binding as default:

```js
import { Input } from 'nautil/components'
import { useState } from 'react'

export default function MyComponent() {
  const value = useState('')
  // Input is a two-way-binding component
  return <Input $value={value}>
}
```

**Pass props as two-way-binding props beginning with `$`.**

The props which begin with `$` will be treated as two-way-binding.
No matter whether the component will receive the prop as two-way-binding prop or not, nautil will parse it as two-way-binding. (So don't define your normal prop begin with `$`.)

```js
import { useTwoWayBinding } from 'nautil/hooks'

class A extends Component {
  static props = {
    // we treate `show` as a normal prop, not two-way-binding
    show: Boolean,
  }
  render() {
    const { show } = this.attrs
    return show ? <span>xxx</span> : null
  }
}

function B(props) {
  // we pass show as a two-way-binding prop
  const show = useTwoWayBinding(props.show, show => props.toggle(show))
  return <A $show={show} />
}
```

In the previous code, we pass `show` as a two-way-binding prop from `B` into `A`, but in `A` we use `show` as a normal prop.
This is ok, we do not need to worry about this even `A` will not change `show` forever.

**You can always modify `this.attrs` directly.**

Unlike `this.props` in react, `this.attrs` in nautil.js can be changed directly.

```js
export default class MyComponent extends Component {
  static props = {
    // `show` should must be a two-way-binding prop
    $show: Boolean,
    // `name` can be normal prop
    name: String,
  }
  render() {
    const { show } = this.attrs
    const toggle = () => {
      // notice here, we change this.attrs.show directly
      this.attrs.show = !show

      // although `name` is not a declared two-way-binding prop, we can change this.attrs.name directly too
      // if `name` is a normal prop, next sentence will not work
      // when and only when the parent component pass name as a two-way-binding prop, this will work
      this.attrs.name = 'some'
    }
    return (
      <>
        <button onClick={toggle}>toggle</button>
        <div stylesheet={{ display: show ? 'block' : 'none' }}>xxx</div>
      </>
    )
  }
}
```

In the previous code, we declare the prop `show` to be a two-way-binding prop. However, we can call `this.attrs.name = 'some'` even thought `name` is not declared to be a two-way-binding prop.

**Change `this.attrs` will happen nothing!**

In the previous code, we call `this.attrs.name = 'some'` or `this.attrs.show = !show`, it seems that the `this.attrs` will change. But, in fact, `this.attrs` will not change unless the parent component make the changes.

```js
class A extends Component {
  static props = {
    show: Boolean,
  }
  render() {
    const { show } = this.attrs
    return <button onClick={() => this.attrs.show = !show}>{show}</button>
  }
}
```

```js
function B() {
  const [show, setShow] = useState(false)
  // nothing will happen when click, because B do nothing when A call `this.attrs.show = !show`
  return <A show={show} />
}
```

```js
import { useState } from 'react'
function C() {
  const show = useState(false)
  // will change the button text when click, becuase you pass a two-way-binding,
  // and when A call `this.attrs.show = !show`, setShow will be called to update show's value
  return <A $show={show} />
}
```

As you seen, we use two-way-binding with `useState` excellently. This is the most prefect way in function components.

**useTwoWayBinding**

Sometimes, you do not use `useState`, for example, in class components. Or, you can only pass an array which contains only two items:

```js
class D extends Component {
  render() {
    const show = [
      !!this.state.show, // first item is the value
      show => this.setState({ show }) // second item is the update function
    ]
    return <A $show={show} />
  }
}
```

We can use `useTwoWayBinding` to create a specail object.

```js
class D extends Component {
  render() {
    const show = useTwoWayBinding(
      !!this.state.show, // first item is the value
      show => this.setState({ show }), // second item is the update function
    )
    return <A $show={show} />
  }
}
```

This function has two parameters:

- value: the value to use
- update: optional, function to be called when the child component change the two-way-binding prop

In some cases, you do not know whether a passed prop is a two-way-prop, you can use it:

```js
class D extends Component {
  render() {
    const show = useTwoWayBinding(this.props.show)
    return <A $show={show} />
  }
}
```

In previous code, we do not know whether `this.props.show` is a two-way-binding, we use `useTwoWayBinding` to wrap it, so that we can pass it into sub components directly.

**createTwoWayBinding**

This function is a special function to get a two-way-binding object which is going to be passed into sub components.

```js
class D extends Component {
  render() {
    const $state = createTwoWayBinding(this.attrs.store.state)
    return <A $show={$state.show} />
  }
}
```

In the previous code, when `A` change the `show`'s value, `store.state.show` will be changed.

It can receive two arguments:

- data: object, which to be proxied
- update: opitonal, function to be called when state.show changed

It is always used with `Store` or `Model` which have `state` property.
We only pass `update` when we pass a normal object as `data`.
