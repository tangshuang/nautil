# Props-Type

This paper tell you how to set props type. As default, you can use react prop-types as what you did in your react application.
However, we developed this, based on [tyshemo](http://github.com/tangshuang/tyshemo), we can check the data structure of props.

## Declare props type

As you learned, we have 3 types of props in nautil: nomal, two-way-binding and even-stream handler. How to declare each type?

```js
import { Component } from 'nautil'

export default class SomeComponent extends Component {
  static props = {
    // normal
    name: String,
    // tow-way-binding
    $show: Boolean,
    // event stream handler
    onHint: true,
  }
}
```

## Define props type

Props-type system support deep nested object checking.

```js
import { Component } from 'nautil'

export default class SomeComponent extends Component {
  static props = {
    some: {
      name: String,
      age: Number,
    },
  }
}
```

Some logic can be inject:

```js
import { Component } from 'nautil'
import { ifexist } from 'nautil/types'

export default class SomeComponent extends Component {
  static props = {
    some: {
      name: ifexist(String),
      age: Number,
    },
  }
}
```

Read [more](https://github.com/tangshuang/tyshemo#type) for type checking.

## Optimization

`props` static property only works in development mode, when you run CLI in production mode, props checking will be dropped, and the `props` static property will be removed from source code.
