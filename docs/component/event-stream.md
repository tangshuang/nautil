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

The pipe function of `on` will run before the pipes of your passed.

```js
<Some onChange={[pipe, subscribe]} />
// here, `pipe` will run after map(value => value ++)
```

## piping and handler

A component handler can receive an array which contains pipes and handler, like this:

```js
<Input onChange={[
  // observable pipe
  map(e => e.target.value),
  map(value => +value),
  // subscribe
  value => this.setState({ value }),
]} />
```

Think this:

```js
const stream$ = new Stream().pipe(
  map(e => e.target.value),
  map(value => +value),
)

stream$.subscribe(value => this.setState({ value }))
```

## stream as handler

A component handler can receive a stream directly, like this:

```js
const some$ = new Stream()

<Input onChange={some$} />
```

This make it possible to pipe before passed into component. And make it possible to subscribe outside current file and subscribe twice or more. However not recommanded, *notice that, a stream can be only used by one component once, when the component is unmounted, the stream will be completed!*

## static stream method

You can define a stream as a static method on a component, like this:

```js
class SomeComponent extends Component {
  static some$(stream) {
    return stream.pipe(...)
  }

  render() {
    return (
      <Input onChange={this.semo$} value={..} />
    )
  }
}
```

This make it possibe to relate business flow with different event action. For example:

```js
class OrderView extends Component {
  static submit$(stream) {
    return stream.pipe(...).subscribe(...)
  }

  static confirm$(stream) {
    // here, we did some logic in pipe, and trigger submit$ finally,
    // which can not be implemented before with a clearify way
    return stream.pipe(...).subscribe(this.submit$)
  }

  render() {
    return (
      <>
        <Button onHit={this.submit$}>submit</Button>
        <Button onHit={this.confirm$}>confirm</Button>
      </>
    )
  }
}
```

## subscribe and dispatch

Inside the component, we should use `subscribe` to subscribe to Observable, use `dispatch` to active stream.

```js
class Some extends Component {
  static props = {
    // we declare a `change` event, and later can be used inside
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
    // unsubscribe the handler
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
  static remove$(stream) {
    stream.subscribe(this.handleRemove)
  }

  handleRemove = () => {
    // ... do some thing
  }
}
```
