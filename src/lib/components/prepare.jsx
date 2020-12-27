import { Any, ifexist } from 'tyshemo'
import { isFunction } from 'ts-fns'

import Component from '../component.js'
import { createPlaceholderComponent } from '../utils.js'

export class Prepare extends Component {
  static props = {
    ready: Boolean,
    pendding: Any,
    render: ifexist(Function),
  }
  render() {
    const { ready, pendding, render } = this.attrs
    return ready
      ? (isFunction(this.children) ? this.children() : isFunction(render) ? render() : this.children )
      : createPlaceholderComponent(pendding)
  }
}
export default Prepare
