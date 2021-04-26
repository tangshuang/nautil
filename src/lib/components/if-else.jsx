/**
 * If, ElseIf, Else
 *
 * <If is={cond1} render={fn1}>
 *  <ElseIf is={cond2} render={fn2} />
 *  <Else render={fn0} />
 * </If>
 *
 * <If is={cond1}>
 *   <Cond1 />
 *   <ElseIf is={cond2}>
 *   <Cond2 />
 *   <Else />
 *   <Rest />
 * </If>
 */

import { ifexist } from 'tyshemo'
import { isFunction } from 'ts-fns'
import { Children, createElement, Fragment } from 'react'

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

    if (is && isFunction(render)) {
      return render()
    }

    let block = {
      is,
      render,
      elements: [],
    }

    const create = () => {
      if (isFunction(block.render)) {
        return createElement(Fragment, {}, ...[].concat(block.render()))
      }
      else if (block.elements.length) {
        return createElement(Fragment, {}, ...block.elements)
      }
      else {
        return null
      }
    }

    const items = Children.toArray(children)
    for (let i = 0, len = items.length; i < len; i ++) {
      const item = items[i]
      const { type } = item

      if (type === Else || type === ElseIf) {
        if (block.is) {
          return create()
        }

        const { props } = item
        const { is, render } = props
        block = {
          is: type === Else ? true : is,
          render,
          elements: [],
        }
      }
      else {
        block.elements.push(item)
      }
    }

    if (block.is) {
      return create()
    }

    return null
  }
}

export default If
