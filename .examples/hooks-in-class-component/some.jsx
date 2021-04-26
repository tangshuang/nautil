import { React, Component, Button } from 'nautil'

export default class Some extends Component {
  // notice, use uppercase `Render`
  Render(props) {
    const [state, setState] = React.useState(props.count)
    return <Button onHit={() => setState(state + 1)}>{state}</Button>
  }
}
