# Props

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

Type checking is following [tyshemo](https://github.com/tangshuang/tyshemo) which is a data schema system in runtime. We will learn more about props type [here](props-type.md).

You can declare 3 kinds of prop:

- normal
- `$` beginning which is two-way-binding prop
- `on` beginning which is event stream handler

After you declare the props, you can use `defaultProps` to give the default values.
