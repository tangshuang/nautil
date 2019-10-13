import Component from '../core/component.js'
import { isFunction, createPlaceholderComponent } from '../core/utils.js'
import { ifexist, enumerate } from '../core/types.js'

export class Prepare extends Component {
  static props = {
    ready: Boolean,
    placeholder: ifexist(enumerate([Function, Component])),
  }
  render() {
    const { ready, placeholder } = this.attrs
    return ready
      ? (isFunction(this.children) ? this.children() : this.children )
      : createPlaceholderComponent(placeholder)
  }
}
export default Prepare
