import { Component as ReactComponent } from 'react'
import {
  each, map, getConstructor, isString, isObject, createHandledStream, isInstanceOf,
  createProxy,
  makeKeyChain,
  clone,
  assign,
  isBoolean,
  uniqueArray,
} from './utils.js'
import { Ty, Binding, Handling, Rule, ifexist } from './types.js'
import Transfrom from '../style/transform.js'
import Store from './store.js'
import { Model } from './model.js'

export class Component extends ReactComponent {
  constructor(props) {
    super(props)

    // update
    this.update = (force) => force ? this.forceUpdate() : this.setState({})

    this.onInit()
    this._digest(props)
  }

  _digest(props) {
    const Constructor = getConstructor(this)
    const { props: PropsTypes, defaultStylesheet = [] } = Constructor

    const fiber = this._reactInternalFiber
    let parentFiber = fiber.return
    let pollution = {}
    let graffiti = []
    while (parentFiber.type) {
      const node = parentFiber.stateNode
      if (node._pollution && node._pollution.component === Constructor) {
        pollution = {
          ...node._pollution.props,
          ...pollution,
        }
      }
      if (node._graffiti && node._graffiti.component === Constructor) {
        graffiti = [
          ...node._graffiti.stylesheet,
          ...graffiti,
        ]
      }
      parentFiber = parentFiber.return
    }

    const { children, stylesheet, style, className, ..._attrs } = props
    this.children = children

    const stylequeue = [].concat(defaultStylesheet).concat(graffiti).concat(stylesheet)
    const attrs = { ...pollution, ..._attrs }

    // stylesheet
    const classNames = []
    const styles = {}
    const patchStylesheetObject = (style = {}) => {
      const rules = this._convertStyle(style)
      each(rules, (value, key) => {
        if (isBoolean(value)) {
          if (value) {
            classNames.push(key)
          }
        }
        else {
          styles[key] = value
        }
      })
    }

    stylequeue.forEach((item) => {
      if (isString(item)) {
        classNames.push(item)
      }
      else if (isObject(item)) {
        patchStylesheetObject(item)
      }
    })

    if (className) {
      classNames.push(className)
    }

    if (style) {
      patchStylesheetObject(style)
    }

    this.className = uniqueArray(classNames.join(' ').split(' ').filter(item => !!item)).join(' ') || undefined
    this.style = this._generateStyle(styles)

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
            handlingTypes[key] = isInstanceOf(type, Rule) && type.name === 'ifexist' ? ifexist(Handling) : Handling
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
  }

  _convertStyle(style = {}) {
    const rules = map(style, (value, key) => {
      if (key === 'transform' && !isBoolean(value)) {
        const rule = Transfrom.convert(value)
        return rule
      }
      else {
        return value
      }
    })
    return rules
  }

  _generateStyle(styles) {
    // will be override in react-native
    return styles
  }

  componentDidMount(...args) {
    this.onMount(...args)
  }
  shouldComponentUpdate(nextProps, ...args) {
    const bool = this.shouldUpdate(nextProps, ...args)
    if (!bool) {
      this.onNotUpdate(nextProps, ...args)
      return false
    }
    else {
      this._digest(nextProps)
      return true
    }
  }
  componentDidUpdate(...args) {
    this.onUpdate(...args)
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
  shouldUpdate() {
    return true
  }
  onNotUpdate() {}
  onUpdate() {}
  onUnmount() {}
  onCatch() {}
}
export default Component
