import { React, Component, createTwoWayBinding } from 'nautil'
import Toggler from './component.jsx'

export default class App extends Component {
  state = {
    show: true,
  }

  render() {
    const $show = createTwoWayBinding(this.state.show, (show) => this.setState({ show }))
    return <Toggler $show={$show} />
  }
}
