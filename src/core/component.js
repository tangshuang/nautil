import React from 'react'
import { each, getConstructor, inObject } from './utils'
import { Ty } from './types'
import { createStream } from './stream'

const digest = Symbol('digest')

export class Component extends React.Component {
  constructor(...args) {
    super(...args)

    this[digest](this.props)
    this.init()
  }

  [digest](props) {
    const Constructor = getConstructor(this)
    const { checkProps, injectProps } = Constructor

    this.streams = {}
    this.children = props.children
    this.attrs = { ...props }

    // data type checking
    if (checkProps) {
      Ty.track(props).by(checkProps)
    }

    // injection
    if (injectProps) {
      each(injectProps, (value, key) => {
        if (!value) {
          return
        }
        delete this[key]
        delete this.attrs[key]
        if (inObject(key, props)) {
          this[key] = props[key]
        }
      })
    }

    // streams
    each(this, (value, key) => {
      if (/^on[A-Z].*\$$/.test(key)) {
        delete this[key]
      }
    })
    each(this.attrs, (value, key) => {
      if (/^on[A-Z]/.test(key)) {
        delete this.attrs[key]
        this[key + '$'] = createStream(value)
      }
    })
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

  init() {}
  // Lifecircle
  shouldUpdate() {
    return true
  }
  onMounted() {}
  onUpdated() {}
}
export default Component
