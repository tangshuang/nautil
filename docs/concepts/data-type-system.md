# Data Type System

To check type and structure of a data, Nautil uses [tyshemo](https://github.com/tangshuang/tyshemo#concepts). You can give a `props` static property to a class component so that props will be checked.

```js
import BookType from '../types/book.type.js'

class MyComponent extends Component {
  static props = {
    data: {
      name: String,
      age: Number,
      books: [BookType],
    },
  }
}
```

As you seen, it is very similar to real data structure, other developers can understand your props structure easily.
