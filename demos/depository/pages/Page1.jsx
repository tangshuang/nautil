import { React, Component, Observer, Prepare, Text } from 'nautil'
import Loading from '../components/Loading.jsx'

export class Page1 extends Component {
  static injectProps = {
    $depo: true,
  }

  render() {
    const depo = this.$depo
    const some = depo.get('some')
    return <Observer subscribe={dispatch => depo.subscribe('some', dispatch)}>
      <Prepare isReady={some} loadingComponent={Loading}>
        <Text>{some}</Text>
      </Prepare>
    </Observer>
  }
}
