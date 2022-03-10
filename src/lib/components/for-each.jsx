import { enumerate, ifexist } from 'tyshemo'
import { each, isFunction } from 'ts-fns'
import { cloneElement, Children } from 'react'

import Component from '../core/component.js'

export class For extends Component {
  static props = {
    start: Number,
    end: Number,
    step: Number,
    map: ifexist(Function),
    render: ifexist(Function),
  }
  static defaultProps = {
    step: 1,
  }

  render() {
    const { start, end, step, map, render } = this.attrs
    const children = this.children
    const blocks = []

    for (let i = start; i <= end; i += step) {
      const data = map ? map(i) : i
      const block = isFunction(render) ? render(data)
        : isFunction(children) ? children(data)
        : Children.map(children, child => cloneElement(child))
      blocks.push(block)
    }
    return blocks
  }
}

export class Each extends Component {
  static props = {
    of: enumerate([Array, Object]),
    map: ifexist(Function),
    render: ifexist(Function),
  }

  render() {
    const obj = this.attrs.of
    const children = this.children
    const blocks = []
    const { map, render } = this.attrs
    const data = map ? map(obj) : obj

    each(data, (value, key) => {
      const block = isFunction(render) ? render(value, key)
        : isFunction(children) ? children(value, key)
        : Children.map(children, child => cloneElement(child))
      blocks.push(block)
    })

    return blocks
  }
}
