import Component from '../core/component.js'
import React from 'react'
import { Any, ifexist } from '../core/types.js'
import { isFunction } from '../core/utils.js'

export class Case extends Component {
  static props = {
    value: Any,
    default: ifexist(Boolean),
  }

  render() {
    return this.children
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

    React.Children.forEach(children, (child) => {
      const { type, props } = child
      const { value, children } = props
      if (type === Case) {
        blocks.push({
          default: props.default,
          value,
          children,
        })
      }
    })

    var use = null
    for (let block of blocks) {
      const { value, children } = block
      if (value === target) {
        use = children.map(child => isFunction(child) ? child() : child)
        break
      }
      else if (isFunction(value) && value()) {
        use = children.map(child => isFunction(child) ? child() : child)
        break
      }
      else if (block.default) {
        use = children.map(child => isFunction(child) ? child() : child)
        break
      }
    }

    return use
  }
}
