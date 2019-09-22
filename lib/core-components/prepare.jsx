import Component from '../core/component.js'
import { isFunction } from '../core/utils.js'

export class Prepare extends Component {
  render() {
    const { isReady, loading } = this.attrs
    return isReady
      ? (isFunction(this.children) ? this.children() : this.children )
      : (loading ? loading : null)
  }
}
export default Prepare
