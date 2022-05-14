import { isFunction } from 'ts-fns'
import { enumerate, ifexist } from 'tyshemo'

import Component from '../core/component.js'

export class Static extends Component {
  static props = {
    shouldUpdate: enumerate([Function, Boolean, Array]),
    render: ifexist(Function),
  }

  shouldUpdate(nextProps) {
    const { shouldUpdate } = nextProps
    return isFunction(shouldUpdate) ? shouldUpdate() : shouldUpdate
  }

  render() {
    const { render } = this.attrs
    return isFunction(render) ? render()
      : isFunction(this.children) ? this.children()
        : this.children
  }
}
export default Static
