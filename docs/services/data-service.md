
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

**source**

A data source is a source which produce data. In Nautil, you should pass a produce function into DataService by use `source` api.

```js
this.source(produce, default)
```

- produce: function which to return data (with `Promise`)
- default: any value wihch to be used before Promise resolved
- @return source object

**query**

To get data from data service, you need to use `query` like this:

```js
this.query(source, ...params)
```

- source: source object which produced by `source` method
- ...params: which will be passed into `produce` function which is `source`'s parameter
- @return [ value, refetch ]
  - value: the current data in service
  - refetch: function to refetch data by running `produce` function

```js
const countSource = this.source((id) => fetch(id).count, 0)
const [count, refetchCount] = this.query(countSource, '123') // here, '123' will be passed into (id) => fetch(id).count
```

**compose**

A composed source is a special data source which can be computed with other data sources.

```js
this.compose(produce)
```

You can use another source inside produce:

```js
// you do not need to pass default value, because a composed source is based on other sources which has default value
const bookSource = this.compose(function(id) {
  const [author] = this.query(bookAuthorSource, id) // bookAuthorSource is defined outer side
  return { id, author }
})
```
