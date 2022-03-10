import { Any, ifexist } from 'tyshemo'
import { isFunction } from 'ts-fns'

import Component from '../core/component.js'
import { createPlaceholderElement } from '../utils.js'

export class Prepare extends Component {
  static props = {
    ready: Boolean,
    pendding: Any,
    render: ifexist(Function),
  }
  render() {
    const { ready, pendding, render } = this.attrs
    return ready
      ? (
        isFunction(render) ? render()
        : isFunction(this.children) ? this.children()
        : this.children
      )
      : createPlaceholderElement(pendding)
  }
}
export default Prepare
