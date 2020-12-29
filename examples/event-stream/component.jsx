import { React, Component, Input } from 'nautil'

export default class Some extends Component {
  static props = {
    value: String,
    onChange: true, // declare a event property
  }

  render() {
    const { value } = this.attrs
    return <Input
      value={value}
      // use `emit` to notify event, which will emit stream this.Change$
      onChange={(e) => this.emit('change', e)}
    />
  }
}
