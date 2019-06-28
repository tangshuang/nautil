import React from 'react'
import { each, getConstructor, inObject, isArray, isString, isObject } from './utils.js'
import { Ty } from './types.js'
import { createStream } from './stream.js'

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
    const { children, stylesheet, ...attrs } = props

    this.children = children
    this.attrs = attrs

    // stylesheet
    const classNames = []
    const styles = {}
    if (isArray(stylesheet)) {
      stylesheet.forEach((item) => {
        if (isString(item)) {
          classNames.push(item)
        }
        else if (isObject(item)) {
          Object.assign(styles, item)
        }
      })
    }
    else if (isObject(stylesheet)) {
      Object.assign(styles, stylesheet)
    }
    else if (isString(stylesheet)) {
      classNames.push(stylesheet)
    }
    this.className = classNames.join(' ').split(' ').filter(item => !!item).join(' ')
    this.style = styles

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
  shouldComponentUpdate(nextProps, ...args) {
    const bool = this.shouldUpdate(nextProps, ...args)
    if (bool) {
      this[digest](nextProps)
    }
    return bool
  }

  // Lifecircle Hooks
  init() {}
  shouldUpdate() {
    return true
  }
  onMounted() {}
  onUpdated() {}
}
export default Component
