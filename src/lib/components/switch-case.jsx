/**
 * Switch, Case
 *
 * <Switch of={some}>
 *   <Case is="0">0</Case>
 *   <Case is="1" break>1</Case>
 *   <Case default>x</Case>
 * </Switch>
 */

import { Any, ifexist } from 'tyshemo'
import { isFunction } from 'ts-fns'
import { Children, isValidElement } from 'react'

import Component from '../core/component.js'

export class Case extends Component {
  static props = {
    is: Any,
    default: ifexist(Boolean),
    break: ifexist(Boolean),
    render: ifexist(Function),
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

    let isMeet = false

    const items = Children.toArray(children)
    for (let i = 0, len = items.length; i < len; i ++) {
      const item = items[i]
      if (!isValidElement(item)) {
        continue
      }

      const { type, props } = item
      if (type !== Case) {
        continue
      }

      const { is, default: isDefault, break: isBreak, render, children } = props
      const h = () => isFunction(render) ? render() : isFunction(children) ? children() : children
      if (is === target) {
        const block = h()
        blocks.push(block)
        isMeet = true
        if (isBreak) {
          break
        }
      }
      if (isDefault && !isMeet) {
        const block = h()
        blocks.push(block)
        break
      }
    }

    return blocks
  }
}
