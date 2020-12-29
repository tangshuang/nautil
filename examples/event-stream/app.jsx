import { React, Component, Stream } from 'nautil'
import Some from './component.jsx'

export default class App extends Component {
  change$ = new Stream()

  state = {
    value: '',
  }

  onInit() {
    this.on('change', e => this.setState({ value: e.target.value }))
  }

  render() {
    return <Some
      value={this.state.value}
      // here, I pass a stream directly into `onChange`
      onChange={this.change$}
    />
  }
}
