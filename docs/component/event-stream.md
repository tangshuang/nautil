# Event Stream

We pass event handlers like in react. However, in Nautil Class Components, you can use rxjs stream to handle events when you pass an array.

```js
<Input onChange={[
  // observable pipe
  map(e => e.target.value),
  map(value => +value),
  // subscribe
  value => this.setState({ value }),
]} />
```

Notice: `onChange` will not affect the value of two-way-binding.

Inside the component, we should use `bind` to subscribe to Observable, use `emit` to active stream.

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
    // here, we should use `Change` as event stream's name
    this.bind('Change', this.handleChange)
  }

  onUnmount() {
    this.unbind('Change', this.handleChange)
  }

  handleInput = (e) => {
    // use emit to active stream
    this.emit('Change', e)
  }
}
```
