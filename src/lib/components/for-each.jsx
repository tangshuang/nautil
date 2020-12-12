import { enumerate, ifexist } from 'tyshemo'
import { each, isFunction } from 'ts-fns'
import { cloneElement, Children } from 'react'

import Component from '../component.js'

export class For extends Component {
  static props = {
    start: Number,
    end: Number,
    step: Number,
    render: ifexist(Function),
  }
  static defaultProps = {
    step: 1,
  }

  render() {
    const { start, end, step, render } = this.attrs
    const children = this.children
    const blocks = []

    for (let i = start; i <= end; i += step) {
      const block = isFunction(children) ? children(i) : isFunction(render) ? render(i) : Children.map(children, child => cloneElement(child))
      blocks.push(block)
    }
    return blocks
  }
}

export class Each extends Component {
  static props = {
    of: enumerate([ Array, Object ]),
    render: ifexist(Function),
  }

  render() {
    const data = this.attrs.of
    const children = this.children
    const blocks = []
    const { render } = this.attrs

    each(data, (value, key) => {
      const block = isFunction(children) ? children(value, key) : isFunction(render) ? render(value, key) : Children.map(children, child => cloneElement(child))
      blocks.push(block)
    })

    return blocks
  }
}
