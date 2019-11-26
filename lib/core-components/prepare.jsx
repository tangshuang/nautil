import Component from '../core/component.js'
import { isFunction, createPlaceholderComponent } from '../utils.js'
import { Any } from '../types.js'

export class Prepare extends Component {
  static props = {
    ready: Boolean,
    placeholder: Any,
  }
  render() {
    const { ready, placeholder } = this.attrs
    return ready
      ? (isFunction(this.children) ? this.children() : this.children )
      : createPlaceholderComponent(placeholder)
  }
}
export default Prepare
