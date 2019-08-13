import React from 'react'
import { each, map, getConstructor, isArray, isString, isObject, throttle, createHandledStream } from './utils.js'
import { Ty } from './types.js'
import Transfrom from '../animation/transform.js'

export class Component extends React.Component {
  constructor(...args) {
    super(...args)

    this.update = throttle(() => this.forceUpdate(), 16)

    const render = this.render.bind(this)
    this.render = () => {
      this.onRender()
      const output = render()
      this.onRendered()
      return output
    }

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
    const patchStyle = (style = {}) => {
      const rules = map(style, (value, key) => {
        if (key === 'transform') {
          const obj = Transfrom.parse(value)
          const rule = Transfrom.generate(obj)
          return rule
        }
        else {
          return value
        }
      })
      Object.assign(styles, rules)
    }
    if (isArray(stylesheet)) {
      stylesheet.forEach((item) => {
        if (isString(item)) {
          classNames.push(item)
        }
        else if (isObject(item)) {
          patchStyle(item)
        }
      })
    }
    else if (isObject(stylesheet)) {
      patchStyle(stylesheet)
    }
    else if (isString(stylesheet)) {
      classNames.push(stylesheet)
    }
    this.className = classNames.join(' ').split(' ').filter(item => !!item).join(' ') || undefined
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
  componentWillMount(...args) {
    this.onRender()
    this.onMount(...args)
  }
  componentDidMount(...args) {
    this.onMounted(...args)
    this.onRendered()
  }
  componentWillUpdate(...args) {
    this.onRender()
    this.onUpdate(...args)
  }
  componentDidUpdate(...args) {
    this.onUpdated(...args)
    this.onRendered()
  }
  shouldComponentUpdate(nextProps, ...args) {
    const bool = this.shouldUpdate(nextProps, ...args)
    if (bool) {
      this._digest(nextProps)
    }
    else {
      this.onNotUpdated(nextProps, ...args)
      this.onRendered()
    }
    return bool
  }
  componentWillUnmount(...args) {
    this.onUnmount(...args)
  }

  // Lifecircle Hooks
  onInit() {}
  onMount() {}
  onMounted() {}
  onUpdate() {}
  shouldUpdate() {
    return true
  }
  onNotUpdated() {}
  onUpdated() {}
  onUnmount() {}
  onRender() {}
  onRendered() {}
}
export default Component
