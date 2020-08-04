/**
 * If, ElseIf, Else
 *
 * <If is={cond1} render={fn1}>
 *  <ElseIf is={cond2} render={fn2} />
 *  <Else render={fn0} />
 * </If>
 */

import { ifexist } from 'tyshemo'
import { isFunction } from 'ts-fns'
import { Children, isValidElement } from 'react'

import Component from '../component.js'

export class Else extends Component {
  static props = {
    render: ifexist(Function),
  }

  render() {
    return null
  }
}

export class ElseIf extends Component {
  static props = {
    is: Boolean,
    render: ifexist(Function),
  }

  render() {
    return null
  }
}

export class If extends Component {
  static props = {
    is: Boolean,
    render: ifexist(Function),
  }

  render() {
    const children = this.children
    const { is, render } = this.attrs

    if (isFunction(children)) {
      return is ? children() : null
    }

    if (is) {
      return render()
    }

    const items = Children.toArray(children)
    for (let i = 0, len = items.length; i < len; i ++) {
      const item = items[i]
      if (!isValidElement(item)) {
        continue
      }

      const { type, props } = item
      if (type === ElseIf) {
        const { is, render } = props
        if (is) {
          return render()
        }
      }

      if (type === Else) {
        const { render } = props
        return render()
      }
    }

    return null
  }
}

export default If
