import React from 'react'
import { each, getConstructor, inObject } from './utils'
import { Ty } from './types'

const digest = Symbol('digest')

export class Component extends React.Component {
  constructor(...args) {
    super(...args)

    this[digest](this.props)
  }

  [digest](props) {
    const Constructor = getConstructor(this)
    const { PropTypes, AcceptableProps } = Constructor

    if (PropTypes) {
      Ty.track(props).by(PropTypes)
    }

    if (AcceptableProps) {
      each(AcceptableProps, (value, key) => {
        if (!value) {
          return
        }
        delete this[key]
        if (inObject(key, props)) {
          this[key] = props[key]
        }
      })
    }

    this.children = props.children
  }

  // Should not rewrite following methods
  componentDidMount(...args) {
    this.onMounted(...args)
  }
  componentDidUpdate(...args) {
    this.onUpdated(...args)
  }
  componentWillReceiveProps(nextProps) {
    this[digest](nextProps)
  }
  shouldComponentUpdate(...args) {
    return this.shouldUpdate(...args)
  }

  // Lifecircle
  shouldUpdate() {
    return true
  }
  onMounted() {}
  onUpdated() {}
}
