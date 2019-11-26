import Component from '../core/component.js'
import React from 'react'
import { isFunction } from '../utils.js'

export class Else extends Component {
  render() {
    return null
  }
}

export class ElseIf extends Component {
  static props = {
    is: Boolean,
  }

  render() {
    return null
  }
}

export class If extends Component {
  static props = {
    is: Boolean,
  }

  render() {
    const children = this.children
    const blocks = []
    const { is } = this.attrs

    var block = {
      type: If,
      is,
      children: [],
    }
    React.Children.forEach(children, (child) => {
      const { type, props } = child
      const { is } = props
      if ([ElseIf, Else].includes(type)) {
        blocks.push(block)
        block = {
          type,
          is,
          children: [],
        }
      }
      else {
        block.children.push(child)
      }
    })
    if (block.children.length) {
      blocks.push(block)
      block = null
    }

    var use = null
    for (let block of blocks) {
      const { type, is, children } = block
      if (is) {
        use = children.map(child => isFunction(child) ? child() : child)
        break
      }
      else if (type === Else) {
        use = children.map(child => isFunction(child) ? child() : child)
        break
      }
    }

    return use
  }
}

export default If
