# Component

Based on [react component](https://reactjs.org/docs/react-component.html), Nautil Component has its own rules.

Although we often use Function Component since react16.8 because of hooks, we will need Class Component in Nautil. Nautil has not enhnaced any things on Function Component. However, you can use [nautil hooks](./hooks.md) functions in Function Components.

This paper will tell you what you can do in a Nautil Class Component.

## Props

You can define a static property in Nautil Component class called `props` to declare the receive props and their types.

```js
import { Component } from 'nautil'

export class MyComponent extends Component {
  static props = {
    // normal prop
    some: String,

    // object prop
    o: {
      name: String,
      age: Number,
    },

    // two-way-binding prop
    $show: Boolean,

    // event handler, there is no need to declare the real type, only pass `true`
    onClick: true,
  }
}
```

Type checking is following [tyshemo](https://github.com/tangshuang/tyshemo) which is a data schema system in runtime. We will learn more about props type [here](./props-type.md).

You can declare 3 kinds of prop:

- normal
- `$` beginning which is two-way-binding prop
- `on` beginning which is event stream handler

After you declare the props, you can use `defaultProps` to give the default values.

## Attrs

There is a `attrs` property on the component instance.

```js
class SomeComponent extends Component {
  render() {
    const { some } = this.attrs
  }
}
```

It is a sub-set of `props`. It is from `props` but not the same. It contains:

```
<Some one={one} $two={two} onSee={onSee} />

+---------------+--------------+
|     props     |     attrs    |
+---------------+--------------+
|               |              |
|      onSee    |       x      |
|               |              |
|   +---------------------+    |
|   |                     |    |
|   |         one         |    |
|   |                     |    |
|   +---------------------+    |
|               |              |
|     $two    ---->    two     |
|               |              |
+---------------+--------------+
```

In the `Some` component, we can read `this.attrs.one` and `this.attrs.two`, `onSee` and `$two` are invisible. `this.attrs.two` is the real value of `this.props.$two[0]`.

## Two-Way-Binding

In nautil.js we can use two-way-binding props. The props which begin with `$` are two-way-binding props.

To know more, we should follow:

**Two-Way-Binding only works on nautil class components.**

React primitive components and Function components do not support two-way-binding.

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

However, you can use two-way-binding components in react components and Function components. For example:

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
No matter whether the component will receive the prop as two-way-binding prop, nautil will parse it as two-way-binding.

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

In the previous code, we pass `show` as a two-way-binding prop into `A` in `B`, but in `A` we use `show` as a normal prop.
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

Sometimes, you do not use `useState`, for example, in class components. We can use `useTwoWayBinding` to create a specail object.

```js
class D extends Component {
  render() {
    const show = useTwoWayBinding(!!this.state.show, show => this.setState({ show }))
    return <A $show={show} />
  }
}
```

This function has two parameters:

- value: the value to use
- reflect: optional, function to be called when the child component change the two-way-binding prop

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
- reflect: opitonal, function to be called when state.show changed

It is always used with `[Store](./store.md)` or `[Model](./model.md)` which have `state` property.
We only pass `reflect` when we pass a normal object as `data`.

## Stylesheet

In nautil.js, we praise css module, which is easy to implement cross-platform.

```js
import { Component } from 'nautil'
import { Section, Text } from 'nautil/components'
import styles from './my-component.css'

export default class MyComponent extends Component {
  render() {
    return (
      <Section stylesheet={styles.container}>
        <Text stylesheet={[styles.text, 'mui-text', this.className]}>xxx</Text>
        <Text stylesheet={[styles.text, { textAlign: 'right' }, this.style]}>xxx</Text>
      </Section>
    )
  }
  static defaultStylesheet = [
    'some-classname',
    { color: 'red' },
  ]
}
```

Read the previous code, you can understand it very easily. You will notice points:

- import .css directly (CSS Module)
- use a `stylesheet` prop
- mixing style object and className in an array
- this.className
- this.style
- defaultStylesheet

**CSS Module**

In nautil, we praise CSS Module, and recommend to use CSS Module at the first. However, you can close CSS Module in `.env` file.
It is not recommended to use style object in react. So use styles in css file.

**stylesheet**

A Nautil Class Component can receive a stylesheet prop. The value will be parse automaticly, it can receive all kinds of style expression in web.

- string: as className
- object:
  - boolean: as className
  - normal: as style rules
- array: mixing

When you pass an object, it dependents on the value of each property. When the value is a boolean, it means you want to toggle this className.

```js
<A stylesheet={{ 'some-classname': !!show, color: '#999000' }} />
```

**this.className**

Get current component's `styesheet` parsed classNames to be a string.

**this.style**

Get current component's `stylesheet` parsed style object.

**defaultStylesheet**

Prefix stylesheet for current component before render.

## Event Stream

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

We will talk about this in [this paper](./stream.md) later.

## Lifecircle

A little different from react, Nautil has its own lifecircle:

- onInit
- onDigested
- onMounted
- onRendered
- =============
- shouldUpdate
- onNotUpdate
- onUpdate
- onDigested
- onUpdated
- onRendered
- =============
- onUnmount
- =============
- onCatch

![](./_assets/nautil-lifecircle.jpg)

Nautil lifecircle functions should not use together with react component life circle functions (except getDerivedStateFromProps and getSnapshotBeforeUpdate).

For Nautil components, they will run a `digest` task to generate derived properties such as `attrs` `style` `className` and so on. After this task, before `render`, a `onDigested` lifecircle function will be called. And, subscribe to event streams should must behind `digest`, so you can only subscribe to event streams in `onDigested`.
