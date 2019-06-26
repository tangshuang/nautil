import React from 'react'
import { each } from './utils'

const hoist = Symbol('hoist')

export class Component extends React.Component {
  constructor(...args) {
    super(...args)

    this[hoist](this.props)
  }

  [hoist](props) {
    each(this, (value, key) => {
      if (key.indexOf('$') === 0) {
        delete this[key]
      }
    })
    each(props, (value, key) => {
      if (key.indexOf('$') === 0) {
        this[key] = value
      }
    })
    this.children = props.children
  }

  // Should not rewrite following methods
  componentDidMount() {
    this.onMounted()
  }
  componentDidUpdate() {
    this.onUpdated()
  }
  componentWillReceiveProps(nextProps) {
    this[hoist](nextProps)
  }
  shouldComponentUpdate(...args) {
    return this.shouldUpdate(...args)
  }

  // Lifecircle
  shouldUpdate() {}
  onMounted() {}
  onUpdated() {}
}
