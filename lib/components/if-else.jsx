import Component from '../core/component.js'
import Fragment from './fragment.jsx'
import React from '../../node_modules/react/umd/react.production.min.js'

export class Else extends Component {
  render() {
    return null
  }
}

export class ElseIf extends Component {
  static checkProps = {
    condition: Boolean,
  }

  render() {
    return null
  }
}

export class If extends Component {
  static checkProps = {
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
      const cloned = React.cloneElement(child)
      const { type, props } = cloned
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
        block.children.push(cloned)
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
        use = <Fragment>{children}</Fragment>
        break
      }
      else if (type === Else) {
        use = <Fragment>{children}</Fragment>
        break
      }
    }

    return use
  }
}
