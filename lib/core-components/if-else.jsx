import Component from '../core/component.js'
import Fragment from './fragment.jsx'
import React from 'react'
import { isFunction } from '../core/utils.js'

export class Else extends Component {
  render() {
    return null
  }
}

export class ElseIf extends Component {
  static props = {
    condition: Boolean,
  }

  render() {
    return null
  }
}

export class If extends Component {
  static props = {
    condition: Boolean,
  }

  render() {
    const children = this.children
    const blocks = []
    const { condition } = this.props

    var block = {
      type: If,
      condition,
      children: [],
    }
    React.Children.forEach(children, (child) => {
      const { type, props } = child
      const { condition } = props
      if ([ElseIf, Else].includes(type)) {
        blocks.push(block)
        block = {
          type,
          condition,
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
      const { type, condition, children } = block
      if (condition) {
        use = <Fragment>{children.map(child => isFunction(child) ? child() : child)}</Fragment>
        break
      }
      else if (type === Else) {
        use = <Fragment>{children.map(child => isFunction(child) ? child() : child)}</Fragment>
        break
      }
    }

    return use
  }
}

export default If
