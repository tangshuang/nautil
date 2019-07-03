import { Component, Prepare, Text, Depository } from 'nautil'
import Loading from '../components/Loading.jsx'

export class Page1 extends Component {
  static validateProps = {
    $depo: Depository,
  }

  static injectProps = {
    $depo: true,
  }

  render() {
    const depo = this.$depo
    const some = depo.get('some')
    return (
      <Prepare isReady={some} loadingComponent={Loading}>
        <Text>{some}</Text>
      </Prepare>
    )
  }
}
