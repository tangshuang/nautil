import React from 'react'
import {
  each, map, getConstructor, isArray, isString, isObject, throttle, createHandledStream, isInstanceOf,
  createProxy,
  makeKeyChain,
  clone,
  assign,
} from './utils.js'
import { Ty, Binding, Handling, Rule, ifexist } from './types.js'
import Transfrom from '../style/transform.js'
import Store from './store.js'
import { Model } from './model.js'

export class Component extends React.Component {
  constructor(...args) {
    super(...args)

    // update
    this.update = throttle((force) => force ? this.forceUpdate() : this.setState({}), 16)

    // render
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

    const modifed = this.onDigest(props) || props
    const { children, stylesheet, style, className, ...attrs } = modifed
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

    if (className) {
      classNames.push(className)
    }

    if (style) {
      patchStyle(style)
    }

    this.className = classNames.join(' ').split(' ').filter(item => !!item).join(' ') || undefined
    this.style = styles


    const finalAttrs = {}
    const finalTypes = {}
    // two-way binding:
    const bindingAttrs = {}
    const bindingTypes = {}
    // handlers
    const handlingAttrs = {}
    const handlingTypes = {}

    // prepare for data type checking
    if (process.env.NODE_ENV !== 'production') {
      if (PropsTypes) {
        const propTypes = { ...PropsTypes }
        each(propTypes, (type, key) => {
          if (key.indexOf('$') === 0) {
            bindingTypes[key] = isInstanceOf(type, Rule) && type.name === 'ifexist' ? ifexist(Binding) : Binding
            const attr = key.substr(1)
            finalTypes[attr] = type
          }
          else if (/^on[A-Z]/.test(key)) {
            handlingTypes[key] = Handling
          }
          else {
            finalTypes[key] = type
          }
        })
      }
    }

    // streams
    each(this, (value, key) => {
      if (/^on[A-Z].*\$$/.test(key)) {
        delete this[key]
      }
    })
    each(attrs, (value, key) => {
      if (/^on[A-Z]/.test(key)) {
        // for type checking
        if (process.env.NODE_ENV !== 'production') {
          if (!handlingTypes[key]) {
            handlingTypes[key] = Handling
          }
          handlingAttrs[key] = value
        }

        delete attrs[key]
        this[key + '$'] = createHandledStream(value)
      }
    })

    // prepare from attrs data
    each(attrs, (data, key) => {
      if (key.indexOf('$') === 0) {
        const attr = key.substr(1)

        // simple way to use two-way binding, use store or model directly
        if (isInstanceOf(data, Store) || isInstanceOf(data, Model)) {
          const { state } = data
          data = [state[attr], v => state[attr] = v]
        }
        else if (isInstanceOf(data.__store__, Store) || isInstanceOf(data.__model__, Model)) {
          const state = data
          data = [state[attr], v => state[attr] = v]
        }

        // not a required prop, check its data type with Binding
        if (process.env.NODE_ENV !== 'production') {
          if (!bindingTypes[key]) {
            bindingTypes[key] = Binding
          }
        }

        bindingAttrs[key] = data
        finalAttrs[attr] = data[0] // $show={[value, reflect]}
      }
      else {
        finalAttrs[key] = data
      }
    })

    // check data type now
    if (process.env.NODE_ENV !== 'production') {
      Ty.expect(bindingAttrs).to.match(bindingTypes)
      Ty.expect(finalAttrs).to.match(finalTypes)
      Ty.expect(handlingAttrs).to.match(handlingTypes)
    }

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
        return false
      },
      del() {
        return false
      },
    })
    this.attrs = state

    this.onDigested()
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
  shouldComponentUpdate(...args) {
    const bool = this.shouldUpdate(...args)
    if (!bool) {
      this.onNotUpdate(...args)
    }
    return bool
  }
  UNSAFE_componentWillUpdate(nextProps, ...args) {
    this._digest(nextProps)
    this.onUpdate(nextProps, ...args)
    this.onRender()
  }
  componentDidUpdate(...args) {
    this.onRendered()
    this.onUpdated(...args)
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
  onNotUpdate() {}
  onUpdated() {}
  onUnmount() {}
  onRender() {}
  onRendered() {}
  onDigest(props) {
    return props
  }
  onDigested() {}
  onCatch() {}
}
export default Component
