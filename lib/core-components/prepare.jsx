import Component from '../core/component.js'

export class Prepare extends Component {
  render() {
    const { isReady, loading } = this.attrs
    return isReady ? this.children : loading ? loading : null
  }
}
export default Prepare
