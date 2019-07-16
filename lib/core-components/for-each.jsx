import Component from '../core/component.js'
import { enumerate } from '../core/types.js'
import Fragment from './fragment.jsx'
import { isArray, isObject, each, isFunction } from '../core/utils.js'
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
    const { start, end, step, children } = this.props
    const blocks = []
    for (let i = start; i <= end; i += step) {
      const block = isFunction(children) ? children(i) : React.Children.map(children, child => React.cloneElement(child))
      blocks.push(block)
    }
    return <Fragment>
      {blocks}
    </Fragment>
  }
}

export class Each extends Component {
  static props = {
    of: enumerate([ Array, Object ]),
  }

  render() {
    const { children } = this.props
    const data = this.props.of
    const blocks = []

    if (isArray(data)) {
      data.forEach((item, i) => {
        const block = isFunction(children) ? children(item, i) : React.Children.map(children, child => React.cloneElement(child))
        blocks.push(block)
      })
    }
    else if (isObject(data)) {
      each(data, (value, key) => {
        const block = isFunction(children) ? children(value, key) : React.Children.map(children, child => React.cloneElement(child))
        blocks.push(block)
      })
    }

    return <Fragment>
      {blocks}
    </Fragment>
  }
}
