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
  const [book, fetchBook, initBook] = useLazyDataSource(BookSource, bookId)
  // book is default value until you trigger initBook
  // initBook will only request data only once, if you invoke initBook again, it will not trigger requesting
  return (
    <button onClick={() => initBook()}>fetch now</button>
  )
}
```
