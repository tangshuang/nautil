# Two-Way-Binding

In Nautil.Component we can use two-way-binding props. The props which begin with `$` are two-way-binding props.

To know more, we should follow:

**Two-Way-Binding only works on nautil class components.**

React primitive components and functional components do not support two-way-binding.

- $prop: pass a prop with `$` beginning outside a class component which extended from Nautil.Component
- this.attrs: receive original attributes
- this.$attrs: proxied attributes which can be modified directly (even in deep nodes)
- this.$state: proxied state which can be modified directly (event in deep nodes)

```js
import { Component } from 'nautil'

export default class MyComponent extends Component {
  static props = {
    $show: Boolean, // pass `$show` prop from outside the component
  }

  render() {
    const { show } = this.attrs // use `this.attrs` to read `show` attribute
    return (
      <>
        <button onClick={() => {
          this.$attrs.show = !show // use `this.$attrs` to rewrite `show` to trigger outside updator
        }}>toggle</button>
        <div style={{ display: show ? 'block' : 'none' }}>xxx</div>
      </>
    )
  }
}
```

Now, `MyComponent` will have a tow-way-binding prop `$show`, you can use it like this:

```js
import { useState } from 'react'

function WrapperComponent() {
  const $show = useState(false)
  return <MyComponent $show={$show} />
}
```

When the two-way-binding prop is beginning with `$` and receive value structed like `[value, updator]`, `updator` is a function like `function(newValue) { ... }`, you can rerender inside this updator function, for example:

```js
const $show = [this.state.isShow, (isShow) => this.setState({ isShow })]
```

Nautil builtin components `Input` `Textarea` `Select` `Checkbox` `Radio` support tow-way-binding as default:

```js
import { Input } from 'nautil'
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
import { useTwoWayBindingAttrs } from 'nautil'

function B(props) {
  // we pass show as a two-way-binding prop outside the component
  const [attrs, $attrs] = useTwoWayBindingAttrs(props)
  return <A $show={[attrs.show, show => $attrs.show = show]} />
}

function C(props) {
  return <A show={true} />
}

class A extends Component {
  static props = {
    // we treate `show` as a normal prop inside component
    // if we define `$show` inside a component, it means we should MUST pass `$show` outside,
    // if we define only `show` inside a component, it means we can pass eigher `show` or `$show` outside
    show: Boolean,
  }
  render() {
    const { show } = this.attrs
    return show ? <span>xxx</span> : null
  }
}
```

In the previous code, we pass `show` as a two-way-binding prop from `B` into `A`, but in `A` we use `show` as a normal prop.
This is ok, we do not need to worry about this even `A` will not change `show` forever.

**You can always modify `this.$attrs` directly.**

Unlike `this.props` in react, `this.$attrs` in nautil.js can be changed directly.

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
      this.$attrs.show = !show

      // although `name` is not a declared two-way-binding prop, we can change this.attrs.name directly too
      // if `name` is a normal prop, next sentence will not work
      // this will work when and only when the parent component pass name as a two-way-binding prop
      this.$attrs.name = 'some'
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

In the previous code, we declare the prop `show` to be a two-way-binding prop so that the component should must receive `$show` prop (if not pass `$show`, error occurs).
We did not declare `name` as a two-way-binding prop, however, we can call `this.attrs.name = 'some'` too (without effects).

**Change `this.$attrs` will happen nothing!**

In the previous code, we call `this.$attrs.name = 'some'` or `this.$attrs.show = !show`, it seems that the `this.$attrs` will change. But, in fact, `this.$attrs` will not change unless the parent component make the changes.

```js
class A extends Component {
  static props = {
    show: Boolean,
  }
  render() {
    const { show } = this.attrs
    return <button onClick={() => this.$attrs.show = !show}>{show}</button>
  }
}
```

```js
function B() {
  const [show, setShow] = useState(false)
  // nothing will happen when click, because B do nothing when A call `this.$attrs.show = !show`
  return <A show={show} />
}
```

```js
import { useState } from 'react'
function C() {
  const show = useState(false)
  // will change the button text when click, becuase you pass a two-way-binding,
  // and when A call `this.$attrs.show = !show`, setShow will be called to update show's value
  return <A $show={show} />
}
```

As you seen, we use two-way-binding with `useState` excellently. This is the most prefect way in function components.
