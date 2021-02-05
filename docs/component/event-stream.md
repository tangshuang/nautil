# Event Stream

We pass event handlers like in react.
However, in Nautil Class Components, you can use rxjs stream to handle events.

```js
<Input onChange={[
  // observable pipe
  map(e => e.target.value),
  map(value => +value),
  // subscribe
  value => this.setState({ value }),
]} />
```

```js
import { Stream } from 'nautil'

const some$ = new Stream()
some$.subscribe(function(e) {
  console.log(e)
})

//////////
<Input onChange={some$} />
```

Inside the component, we should use `on` to subscribe to Observable, use `emit` to active stream.

```js
class Some extends Component {
  static props = {
    onChange: true,
  }

  handleChange = stream => {
    // here, you should return a new stream if you want to change the stream
    // if you just want to subscribe on original stream, you can return nothing
    return stream.pipe(
      map(value => value ++)
    )
  }

  onInit() {
    // here, we should use `change` as event stream's name
    this.on('change', this.handleChange)
  }

  onUnmount() {
    this.off('change', this.handleChange)
  }

  handleInput = (e) => {
    // use emit to active stream
    // skill: you can emit('Change') or emit('change'), they are the same
    this.emit('change', e)
  }
}
```

The pipe function of `on` will run before the pipes of your passed.

```js
<Some onChange={[pipe, subscribe]} />
// here, `pipe` will run after map(value => value ++)
```
