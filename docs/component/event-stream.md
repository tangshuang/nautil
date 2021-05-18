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

Inside the component, we should use `subscribe` to subscribe to Observable, use `dispatch` to active stream.

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
    // here, we should use `change` or `Change` as event stream's name
    // the first case of stream's name is uppercase, but we can use lowercase for it to write more comfortable
    this.subscribe('change', this.handleChange)
  }

  onUnmount() {
    this.unsubscribe('change', this.handleChange)
  }

  handleInput = (e) => {
    // use dispatch to active stream
    // skill: you can dispatch('Change') or dispatch('change'), they are the same
    this.dispatch('change', e)
  }

  // static properties those begin with upper case will be treated as default streams
  // `default` means you can declare it in `props` to override by passing from outside
  // only begin with upper case will work
  // this.Remove$ is there, subscribe, dispatch works on these streams
  // `this` inside the function point to component instance
  static Remove$(stream) {
    stream.subscribe(this.handleRemove)
  }

  handleRemove = () => {
    // ... do some thing
  }
}
```

The pipe function of `on` will run before the pipes of your passed.

```js
<Some onChange={[pipe, subscribe]} />
// here, `pipe` will run after map(value => value ++)
```
