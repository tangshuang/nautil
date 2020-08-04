import { Any, ifexist } from 'tyshemo'
import { isFunction } from 'ts-fns'

import Component from '../component.js'
import { createPlaceholderComponent } from '../utils.js'

export class Prepare extends Component {
  static props = {
    ready: Boolean,
    wait: Any,
    render: ifexist(Function),
  }
  render() {
    const { ready, wait, render } = this.attrs
    return ready
      ? (isFunction(this.children) ? this.children() : isFunction(render) ? render() : this.children )
      : createPlaceholderComponent(wait)
  }
}
export default Prepare
