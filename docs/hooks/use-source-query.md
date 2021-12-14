# useSourceQuery

```js
import { DataService, useSourceQuery } from 'nautil'

const BookSource = DataService.source((bookId) => { ... }, {})

function MyComponent({ bookId }) {
  const [book, renewBook] = useSourceQuery(BookSource, bookId)
  ...
}
```
