# Props-Type

This paper will tell you how to set props type. As default, you can use react prop-types as what you did in your react application.
However, we developed this, based on [tyshemo](http://github.com/tangshuang/tyshemo), we can check the data structure of props.
## Declare props type

As you learned, we have 3 types of props in nautil: normal, two-way-binding and event-stream. How to declare each type?

```js
import { Component } from 'nautil'

export default class SomeComponent extends Component {
  static props = {
    // normal
    name: String,
    // tow-way-binding
    $show: Boolean,
    // event stream handler, only pass `true` to make it work
    onHit: true,
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
import { ifexist } from 'tyshemo'

export default class SomeComponent extends Component {
  static props = {
    some: {
      name: ifexist(String),
      age: Number,
    },
  }
}
```

Read [more](https://tyshemo.js.org) for type checking.

## Optimization

`props` static property only works in development mode, when you run CLI in production mode, props checking will be dropped, and the `props` static property will be removed from source code by Nautil-CLI.

## Async Checking

If you give `props` as a function, props type checking will run asyncly.

```js
class SomeComponent extends Component {
  static props = () => ({
    name: String,
    age: Number,
  })
}
```
