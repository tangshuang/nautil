import React from 'react'
import { each, getConstructor, inObject, isArray, isString, isObject, throttle } from './utils.js'
import { Ty } from './types.js'
import { createHandledStream } from './stream.js'

export class Component extends React.Component {
  constructor(...args) {
    super(...args)

    this.update = throttle(() => this.forceUpdate(), 16)

    this._digest(this.props)
    this.onInit()
  }

  _digest(props) {
    const Constructor = getConstructor(this)
    const { props: propsTypes } = Constructor
    const { children, stylesheet, ...attrs } = props

    // data type checking
    if (propsTypes) {
      Ty.expect(props).to.match(propsTypes)
    }

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

    // streams
    each(this, (value, key) => {
      if (/^on[A-Z].*\$$/.test(key)) {
        delete this[key]
      }
    })
    each(attrs, (value, key) => {
      if (/^on[A-Z]/.test(key)) {
        delete attrs[key]
        this[key + '$'] = createHandledStream(value)
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
      this._digest(nextProps)
    }
    return bool
  }
  componentWillUnmount(...args) {
    this.onUnmount(...args)
  }

  // Lifecircle Hooks
  onInit() {}
  onMounted() {}
  shouldUpdate() {
    return true
  }
  onUpdated() {}
  onUnmount() {}
}
export default Component
