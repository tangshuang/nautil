import Component from '../core/component.js'
import { enumerate } from '../types.js'
import { isArray, isObject, each, isFunction, cloneElement, mapChildren } from '../utils.js'

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
    const { start, end, step } = this.attrs
    const children = this.children
    const blocks = []

    for (let i = start; i <= end; i += step) {
      const block = isFunction(children) ? children(i) : mapChildren(children, child => cloneElement(child))
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
    const data = this.attrs.of
    const children = this.children
    const blocks = []

    if (isArray(data)) {
      data.forEach((item, i) => {
        const block = isFunction(children) ? children(item, i) : mapChildren(children, child => cloneElement(child))
        blocks.push(block)
      })
    }
    else if (isObject(data)) {
      each(data, (value, key) => {
        const block = isFunction(children) ? children(value, key) : mapChildren(children, child => cloneElement(child))
        blocks.push(block)
      })
    }

    return blocks
  }
}
