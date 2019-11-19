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
|      onSee    |              |
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

*Two-Way-Binding only works on nautil class components.*

React primitive components and Function components do not support two-way-binding. However, you can use two-way-binding components in react components and Function components. For example:

```js
import { Input } from 'nautil/components'
import { useState } from 'react'

export default function MyComponent() {
  const value = useState('')
  // Input is a two-way-binding component
  return <Input $value={value}>
}
```

*Pass props as two-way-binding props beginning with `$`.*

The props which begin with `$` will be treated as two-way-binding.
