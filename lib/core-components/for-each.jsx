import Component from '../core/component.js'
import { enumerate } from '../types.js'
import { isArray, isObject, each, isFunction, cloneElement, mapChildren } from '../utils.js'

import { ifexist } from '../types.js'
import { render } from 'react-dom'

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
      const block = isFunction(children) ? children(i) : isFunction(render) ? render(i) : mapChildren(children, cloneElement)
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

    each(data, (value, key) => {
      const block = isFunction(children) ? children(value, key) : isFunction(render) ? render(value, key) : mapChildren(children, cloneElement)
      blocks.push(block)
    })

    return blocks
  }
}
