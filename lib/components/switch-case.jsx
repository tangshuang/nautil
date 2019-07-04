import Component from '../core/component.js'
import Fragment from './fragment.jsx'
import React from 'react'
import { Any, ifexist } from '../core/types.js'
import { isFunction } from '../core/utils.js'

export class Case extends Component {
  static validateProps = {
    value: Any,
    default: ifexist(Boolean),
  }

  render() {
    return <Fragment>{this.children}</Fragment>
  }
}

export class Switch extends Component {
  static validateProps = {
    of: Any,
  }

  render() {
    const children = this.children
    const target = this.props.of
    const blocks = []

    React.Children.forEach(children, (child) => {
      const cloned = React.cloneElement(child)
      const { type, props } = cloned
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
        use = <Fragment>{children}</Fragment>
        break
      }
      else if (isFunction(value) && value()) {
        use = <Fragment>{children}</Fragment>
        break
      }
      else if (block.default) {
        use = <Fragment>{children}</Fragment>
        break
      }
    }

    return use
  }
}
