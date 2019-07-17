import Component from '../core/component.js'
import { enumerate } from '../core/types.js'
import { isArray, isObject, each, isFunction, cloneElement } from '../core/utils.js'
import React from 'react'

export class For extends Component {
  static props = {
    start: Number,
    end: Number,
    step: Number,
  }
  static defaultProps = {
    step: 1,
  }

  render() {
    const { start, end, step, children } = this.attrs
    const blocks = []
    for (let i = start; i <= end; i += step) {
      const block = isFunction(children) ? children(i) : React.Children.map(children, child => cloneElement(child))
      blocks.push(block)
    }
    return blocks
  }
}

export class Each extends Component {
  static props = {
    of: enumerate([ Array, Object ]),
  }

  render() {
    const { children } = this.attrs
    const data = this.attrs.of
    const blocks = []

    if (isArray(data)) {
      data.forEach((item, i) => {
        const block = isFunction(children) ? children(item, i) : React.Children.map(children, child => cloneElement(child))
        blocks.push(block)
      })
    }
    else if (isObject(data)) {
      each(data, (value, key) => {
        const block = isFunction(children) ? children(value, key) : React.Children.map(children, child => cloneElement(child))
        blocks.push(block)
      })
    }

    return blocks
  }
}
