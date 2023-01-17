# useDataSource

```js
import { DataService, useDataSource } from 'nautil'

const BookSource = DataService.source((bookId) => { ... }, {})

function MyComponent({ bookId }) {
  const [book, renewBook] = useDataSource(BookSource, bookId)
  ...
}
```
