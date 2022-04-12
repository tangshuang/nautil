# useDataSource

```js
import { DataService, useDataSource } from 'nautil'

const BookSource = DataService.source((bookId) => { ... }, {})

function MyComponent({ bookId }) {
  const [book, renewBook] = useDataSource(BookSource, bookId)
  ...
}
```

## useLazyDataSource

```js
import { DataService, useLazyDataSource } from 'nautil'

const BookSource = DataService.source((bookId) => { ... }, {})

function MyComponent({ bookId }) {
  const [book, fetchBook] = useLazyDataSource(BookSource, bookId)
  // book is default value until you trigger fetchBook
  return (
    <button onClick={() => fetchBook()}>fetch now</button>
  )
}
```
