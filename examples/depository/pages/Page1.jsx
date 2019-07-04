import { Component, Prepare, Text } from 'nautil'
import Loading from '../components/Loading.jsx'

export class Page1 extends Component {
  static injectProviders = {
    $depo: true,
  }

  render() {
    const depo = this.$depo
    const some = depo.get('some')

    return (
      <Prepare isReady={some} loadingComponent={<Loading />}>
        <Text>{some}</Text>
      </Prepare>
    )
  }
}
