
# DataService

A special type of Service `DataService` is used to manage data sources.

```js
import { DataService, Controller } from 'nautil'

class MyDataService extends DataService {
  some = this.source((id) => fetch('url').then(res => res.json()), {})
}

class MyController extends Controller {
  static dataService = MyDataService
  Some(props) {
    const { id } = props
    const [some, refetchSome] = this.dataService.query(this.dataService.some, id)

    return (
      <Section onHit={refetchSome}>
        <Text>name: {some.name}</Text>
      </Section>
    )
  }
}
```

## API

### source(produce: (...params: any[]) => any, default: any): Source

A data source is a source which produce data. In Nautil, you should pass a produce function into DataService by use `source` api.

```js
const source = this.source(produce, default)
```

- produce: function which to return data (can be with `Promise`)
- default: any value wihch to be used before Promise resolved
- @return Source object

### query(source: Source, ...params: any[]): [data: any, renew: Function]

To get data from data service, you need to use `query` like this:

```js
const [data, renew] = this.query(source, ...params)
```

- source: source object which produced by `source` method
- ...params: which will be passed into `produce` function which is `source`'s parameter
- @return [data, renew]
  - data: the current data in service
  - renew: function to refetch data by running `produce` function

```js
const countSource = this.source((id) => fetch(id).count, 0)
const [count, refetchCount] = this.query(countSource, '123') // here, '123' will be passed into (id) => fetch(id).count
```

**get(source: Source, ...params: any[]): any**

Shot to get `data` from a source.

**request(source: Source: ...params: any[]): Promise\<any\>**

Shot to get `renew` from a source.

```js
const data = await this.request(countSource, '123')
```

### compose(produce: Function): CompoundSource

A composed source is a special data source which can be computed with other data sources.

```js
const source = this.compose(produce)
```

You can use another source inside produce:

```js
// you do not need to pass default value, because a composed source is based on other sources which has default value
const bookSource = this.compose(function(id) {
  const [author] = this.query(bookAuthorSource, id) // bookAuthorSource is defined outer side
  return { id, author }
})
```

Notice, you do not need to give `default` as second parameter, because compose produce should must be a sync function to return value.

The difference between `query` and `compose`:

- query need `default`, compose not
- query's produce function can be async, compose's should be sync
- query's produce function is a pure getter to generate data, compose's produce can contains Source, CompoundSource or Hooks (detail next part)

CompoundSource's `renew` function can receive certain Source as parameter:

```js
const [book, updateBook] = this.query(bookSource)
updateBook(bookSource) // if you compose any other Source inside compose's produce, you can call it to renew it only
```

### setup(fn: Function): Context<{ stop: Function, next: Function, value: any }>

Setup effects when data sources change:

```js
this.setup(() => {
  const [data] = this.query(source)
})
```

> The deep theory of DataService is following React's hooks. Tohe given function of `setup` will be run again if your invoke `renew`, so that the function of `setup` will be run again to make `query` return new data.

## Hooks


You can only use hooks inside `compose`.

### affect(fn: Function, deps: any[]): void

Like React's `useEffect`, you can seed some effects inside `compose`:

```js
this.compose(() => {
  const [book, renewBook] = this.query(this.bookSource)

  // here we have an effect to renew book source each 5s
  this.affect(() => {
    const timer = setInterval(renewBook, 5000)
    return () => clearInterval(timer)
  }, [])

  return book
})
```

### select(calc: Function, deps: any[]): any

Like React's `useMemo`, you can compute a value by remember.

```js
this.compose(() => {
  const [book, renewBook] = this.query(this.bookSource)

  const bookRealPage = this.select(() => {
    const { total, cover } = book
    return total - cover
  }, [book.total, book.cover])

  return {
    ...book,
    real_page: bookRealPage,
  }
})
```

### apply(produce: Function, default: any): QueryFunction

Sometimes you do not want to create a source and want to apply source in runtime, you can use `apply`:

```js
this.compose(() => {
  const query = this.apply(() => ...) // like this.source
  const [book, renewBook] = query() // like this.query
  return book
})
```

### ref(value: any)

Like React's `useRef`, you can keep a static reference inside.

```js
const Mix = compose(function() {
  const some = ref(0)

  affect(() => {
    setInterval(() => {
      some.value ++ // change some.value will have no effects
    }, 1000)
  }, [])

  const any = select(() => some.value % 2, [some.value])
  ...
})
```
