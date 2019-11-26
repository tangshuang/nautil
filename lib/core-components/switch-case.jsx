import Component from '../core/component.js'
import { Any, ifexist } from '../core/types.js'
import { isFunction, mapChildren } from '../utils.js'

export class Case extends Component {
  static props = {
    is: Any,
    default: ifexist(Boolean),
  }

  render() {
    return null
  }
}

export class Switch extends Component {
  static props = {
    of: Any,
  }

  render() {
    const children = this.children
    const target = this.attrs.of
    const blocks = []

    mapChildren(children, (child) => {
      const { type, props } = child
      const { is, children } = props
      if (type === Case) {
        blocks.push({
          default: props.default,
          is,
          children,
        })
      }
    })

    var use = null
    for (let block of blocks) {
      const { is, children } = block
      if (is === target) {
        use = mapChildren(children, child => isFunction(child) ? child() : child)
        break
      }
      else if (isFunction(is) && is()) {
        use = mapChildren(children, child => isFunction(child) ? child() : child)
        break
      }
      else if (block.default) {
        use = mapChildren(children, child => isFunction(child) ? child() : child)
        break
      }
    }

    return use
  }
}
