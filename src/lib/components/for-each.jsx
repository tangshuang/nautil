import { enumerate, ifexist } from 'tyshemo'
import { each, isFunction, isArray, decideby } from 'ts-fns'
import { cloneElement, Children, Fragment } from 'react'

import { Component } from '../core/component.js'
import { useUniqueKeys } from '../hooks/unique-keys.js'

export class For extends Component {
  static props = {
    start: Number,
    end: Number,
    step: Number,
    unique: ifexist(enumerate([String, Function])),
    map: ifexist(Function),
    render: ifexist(Function),
  }
  static defaultProps = {
    step: 1,
  }

  render() {
    const { start, end, step, map, render, unique } = this.attrs
    const children = this.children
    const blocks = []

    for (let i = start; i <= end; i += step) {
      const data = map ? map(i) : i
      const uniqueKey = unique ? (isFunction(unique) ? unique(data, i) : (data && typeof data === 'object' ? data[unique] : i)) : i
      const block = decideby(() => {
        if (isFunction(render)) {
          return render(data, i, uniqueKey)
        }
        if (isFunction(children)) {
          return children(data, i, uniqueKey)
        }
        return <Fragment key={uniqueKey}>{Children.map(children, (child) => cloneElement(child))}</Fragment>
      })
      if (!block) {
        return
      }
      if (block.key) {
        blocks.push(block)
      } else {
        blocks.push(<Fragment key={uniqueKey}>{block}</Fragment>)
      }
    }
    return blocks
  }
}

export class Each extends Component {
  static props = {
    of: enumerate([Array, Object]),
    unique: ifexist(enumerate([String, Function])),
    map: ifexist(Function),
    render: ifexist(Function),
  }

  Render() {
    const obj = this.attrs.of
    const children = this.children
    const blocks = []
    const { map, render, unique } = this.attrs
    const data = map ? map(obj) : obj

    const keys = useUniqueKeys(isArray(data) ? data : [])

    each(data, (value, key) => {
      const defaultKey = isArray(data) ? keys[key] : key
      const uniqueKey = unique
        ? (
          isFunction(unique) ? unique(value, key)
            : (value && typeof value === 'object' ? value[unique] : defaultKey)
        )
        : defaultKey
      const block = decideby(() => {
        if (isFunction(render)) {
          return render(value, key, uniqueKey)
        }
        if (isFunction(children)) {
          return children(value, key, uniqueKey)
        }
        return <Fragment key={uniqueKey}>{Children.map(children, (child) => cloneElement(child))}</Fragment>
      })
      if (!block) {
        return
      }
      if (block.key) {
        blocks.push(block)
      } else {
        blocks.push(<Fragment key={uniqueKey}>{block}</Fragment>)
      }
    })

    return blocks
  }
}
