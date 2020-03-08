import Component from '../core/component.js'
import { isFunction } from '../utils.js'
import { Any, ifexist } from '../types.js'

export class Static extends Component {
  static props = {
    shouldUpdate: Any,
    render: ifexist(Function),
  }
  shouldUpdate(nextProps) {
    return nextProps.shouldUpdate
  }
  render() {
    const { render } = this.attrs
    return isFunction(this.children) ? this.children() : isFunction(render) ? render() : this.children
  }
}
export default Static
