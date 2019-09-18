import React from 'react'
import {
  each, map, getConstructor, isArray, isString, isObject, throttle, createHandledStream, isInstanceOf,
  createProxy,
  makeKeyChain,
  clone,
  assign,
} from './utils.js'
import { Ty, Binding, Handling } from './types.js'
import Transfrom from '../style/transform.js'
import Store from './store.js'

export class Component extends React.Component {
  constructor(...args) {
    super(...args)

    this.update = throttle((force) => force ? this.forceUpdate() : this.setState({}), 16)

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
    const { props: PropsTypes } = Constructor

    const { children, stylesheet, ...attrs } = props
    this.children = children

    // stylesheet
    const classNames = []
    const styles = {}
    const patchStyle = (style = {}) => {
      const rules = this._convertStyle(style)
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

    if (attrs.className) {
      classNames.push(attrs.className)
      delete attrs.className
    }

    if (attrs.style) {
      patchStyle(attrs.style)
      delete attrs.style
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
        Ty.expect(value).to.match(Handling) // type checking
        delete attrs[key]
        this[key + '$'] = createHandledStream(value)
      }
    })

    // two-way binding:
    const finalAttrs = {}
    const bindingAttrs = {}
    const finalTypes = {}
    const bindingTypes = {}

    // prepare for data type checking
    if (PropsTypes) {
      const propTypes = { ...PropsTypes }
      each(propTypes, (type, key) => {
        if (key.indexOf('$') === 0) {
          bindingTypes[key] = Binding
          const attr = key.substr(1)
          finalTypes[attr] = type
        }
        else {
          finalTypes[key] = type
        }
      })
    }

    // prepare from attrs data
    each(attrs, (data, key) => {
      if (key.indexOf('$') === 0) {
        // not a required prop, check its data type with Binding
        if (!bindingTypes[key]) {
          Ty.expect(data).to.match(Binding)
        }

        bindingAttrs[key] = data
        const attr = key.substr(1)
        finalAttrs[attr] = data[0] // $show={[value, reflect]}
      }
      else {
        finalAttrs[key] = data
      }
    })

    // check data type now
    Ty.expect(bindingAttrs).to.match(bindingTypes)
    Ty.expect(finalAttrs).to.match(finalTypes)

    // create two-way binding props
    const state = createProxy(finalAttrs, {
      set([obj, keyPath, value]) {
        const root = makeKeyChain(keyPath).shift()
        const bindKey = '$' + root
        const bindData = bindingAttrs[bindKey]
        if (bindData) {
          const reflect = bindData[1]
          const cloned = clone(obj)
          const modifed = assign(cloned, keyPath, value)
          const current = obj[root]
          const next = modifed[root]
          reflect(next, current)
        }
        else if (process.env.NODE_ENV !== 'production') {
          console.error(`You can not set value to component's this.attrs.${keyPath}.`)
        }
        return false
      },
      del() {
        return false
      },
    })
    this.attrs = state
  }

  _convertStyle(style = {}) {
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
    return rules
  }

  // Should not rewrite following methods
  UNSAFE_componentWillMount(...args) {
    this.onMount(...args)
    this.onRender()
  }
  componentDidMount(...args) {
    this.onRendered()
    this.onMounted(...args)
  }
  UNSAFE_componentWillUpdate(nextProps, ...args) {
    this.onUpdate(nextProps, ...args)
    this._digest(nextProps)
    this.onRender()
  }
  componentDidUpdate(...args) {
    this.onRendered()
    this.onUpdated(...args)
  }
  shouldComponentUpdate(...args) {
    const bool = this.shouldUpdate(...args)
    if (!bool) {
      this.onNotUpdated(...args)
    }
    return bool
  }
  componentWillUnmount(...args) {
    this.onUnmount(...args)
  }
  componentDidCatch(...args) {
    this.onCatch(...args)
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
  onCatch() {}
}
export default Component
