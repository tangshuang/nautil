import { isFunction } from 'ts-fns'
import { Any, ifexist } from 'tyshemo'

import Component from '../component.js'

export class Static extends Component {
  static props = {
    shouldUpdate: Any,
    render: ifexist(Function),
  }
  shouldUpdate(nextProps) {
    const { shouldUpdate } = nextProps
    return isFunction(shouldUpdate) ? shouldUpdate() : shouldUpdate
  }
  render() {
    const { render } = this.attrs
    return isFunction(this.children) ? this.children() : isFunction(render) ? render() : this.children
  }
}
export default Static
