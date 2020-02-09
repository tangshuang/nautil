import Component from '../core/component.js'
import { isFunction, createPlaceholderComponent } from '../utils.js'
import { Any, ifexist } from '../types.js'

export class Prepare extends Component {
  static props = {
    ready: Boolean,
    placeholder: Any,
    render: ifexist(Function),
  }
  render() {
    const { ready, placeholder, render } = this.attrs
    return ready
      ? (isFunction(this.children) ? this.children() : isFunction(render) ? render() : this.children )
      : createPlaceholderComponent(placeholder)
  }
}
export default Prepare
