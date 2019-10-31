import { Component as ReactComponent } from 'react'
import {
  each, map, getConstructor, isString, isObject, createHandledStream, isInstanceOf,
  createProxy,
  makeKeyChain,
  clone,
  assign,
  isBoolean,
  uniqueArray,
  cloneElement,
  mapChildren,
  isArray,
  isFunction,
  isInheritedOf,
} from './utils.js'
import { Ty, Binding, Handling, Rule, ifexist } from './types.js'
import Transfrom from '../style/transform.js'
import Store from './store.js'
import { Model } from './model.js'

export class ReflectComponent extends ReactComponent {
  constructor(props) {
    super(props)

    // update
    this.update = () => this.setState({})

    // render
    const _render = this.render.bind(this)
    this.render = () => {
      const tree = _render()
      const polluted = this._polluteRenderTree(tree)
      return polluted
    }
  }

  _polluteRenderTree(tree) {
    let pollutedComponents = this._pollutedComponents || []

    // there is no fiber in SSR
    // pollute is invoked in onInit in SSR, look into operators.js
    if (process.env.RUNTIME_ENV === 'ssr') {
      const { propofpollutedcomponents = [] } = this.props
      pollutedComponents = [].concat(propofpollutedcomponents).concat(pollutedComponents)

      // pollute children tree by using parent passed prop
      const map = (node) => {
        if (!node || typeof node !== 'object') {
          return node
        }

        let { type, props } = node
        if (!type) {
          return node
        }

        // when meet a Function Component, wrapper it with class component
        // so that we can use pollute
        if (isFunction(type) && !isInheritedOf(type, ReactComponent)) {
          class FunctionComponent extends ReflectComponent {
            render() {
              return type(this.props)
            }
          }
          node = <FunctionComponent {...props} />
          props = node.props
        }
        else if (typeof type === 'function' && isInheritedOf(type, ReactComponent)) {
          const _render = type.prototype.render
          const _polluteRenderTree = Component.prototype._polluteRenderTree
          type.prototype.render = function() {
            const tree = _render.call(this)
            const polluted = _polluteRenderTree.call(this, tree)
            return polluted
          }
        }

        const { children } = props
        const subtree = modify(children)
        const polluted = typeof type === 'string' ? { propofpollutedcomponents: undefined } : { propofpollutedcomponents: pollutedComponents }

        return cloneElement(node, polluted, subtree)
      }
      const modify = (tree) => {
        if (isArray(tree)) {
          const modifed = mapChildren(tree, map)
          return modifed
        }
        else {
          const modifed = map(tree)
          return modifed
        }
      }
      tree = modify(tree)
    }
    else {
      const fiber = this._reactInternalFiber
      // pollute children tree by using parent fiber tree
      let parent = fiber.return
      while (parent) {
        const node = parent.stateNode
        if (node) {
          const parentPollutedComponents = node._pollutedComponents || []
          pollutedComponents = [...parentPollutedComponents, ...pollutedComponents]
        }
        parent = parent.return
      }
    }

    const map = (node) => {
      if (!node || typeof node !== 'object') {
        return node
      }

      const { type, props } = node
      if (!type) {
        return node
      }

      const pollutedProps = {}
      pollutedComponents.forEach((item) => {
        const { component, props } = item
        if (component === type || Object.getPrototypeOf(type) === component) {
          Object.assign(pollutedProps, props)
        }
      })

      const { children } = props
      const subtree = modify(children)

      return cloneElement(node, { ...pollutedProps }, subtree)
    }
    const modify = (tree) => {
      if (isArray(tree)) {
        const modifed = mapChildren(tree, map)
        return modifed
      }
      else {
        const modifed = map(tree)
        return modifed
      }
    }

    const output = modify(tree)
    return output
  }
}

export class Component extends ReflectComponent {
  constructor(props) {
    super(props)

    // forceUpdate
    const forceUpdate = this.forceUpdate.bind(this)
    this.forceUpdate = () => {
      this.onUpdate(this.props, this.state)
      this._digest(this.props)
      return forceUpdate()
    }

    this.onInit()
    this._digest(props)
  }

  _digest(props) {
    const Constructor = getConstructor(this)
    const { props: PropsTypes, defaultStylesheet = [] } = Constructor
    const { children, stylesheet, style, className, ...attrs } = props

    /**
     * Format stylesheet by using stylesheet, className, style props
     */
    const stylequeue = [].concat(defaultStylesheet).concat(stylesheet).concat(className).concat(style)
    const classNames = []
    const styles = {}
    const patchStylesheetObject = (style = {}) => {
      each(style, (value, key) => {
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

    /**
     * Prepare for data type checking and attrs real context
     */
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
          if (/^\$[a-zA-Z]/.test(key)) {
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

    // prepare for streams
    each(attrs, (value, key) => {
      if (/^on[A-Z]/.test(key)) {
        // for type checking
        if (process.env.NODE_ENV !== 'production') {
          if (!handlingTypes[key]) {
            handlingTypes[key] = Handling
          }
        }

        handlingAttrs[key] = value
        delete attrs[key]
      }
    })

    // prepare for attrs data
    each(attrs, (data, key) => {
      if (/^\$[a-zA-Z]/.test(key)) {
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

    /**
     * Set special properties on this
     */
    this.className = uniqueArray(classNames.join(' ').split(' ').filter(item => !!item)).join(' ') || undefined
    this.style = this._generateStyle(styles)
    this.children = children
    this.attrs = state
    // streams
    each(this, (value, key) => {
      if (/^on[A-Z].*\$$/.test(key)) {
        delete this[key]
      }
    })
    each(handlingAttrs, (value, key) => {
      this[key + '$'] = createHandledStream(value)
    })

    this.onDigested()
  }

  _generateStyle(styles, iterate) {
    // will be override in react-native
    const rules = map(styles, (value, key) => {
      if (key === 'transform' && !isBoolean(value)) {
        const rule = Transfrom.convert(value)
        return rule
      }
      else if (isFunction(iterate)) {
        return iterate(value, key)
      }
      else {
        return value
      }
    })
    return rules
  }

  componentDidMount(...args) {
    this.onMounted(...args)
  }
  shouldComponentUpdate(nextProps, ...args) {
    const bool = this.shouldUpdate(nextProps, ...args)
    if (!bool) {
      this.onNotUpdate(nextProps, ...args)
      return false
    }
    else {
      this.onUpdate(nextProps, ...args)
      this._digest(nextProps)
      return true
    }
  }
  componentDidUpdate(...args) {
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
  onMounted() {}
  shouldUpdate() {
    return true
  }
  onNotUpdate() {}
  onUpdate() {}
  onUpdated() {}
  onUnmount() {}
  onCatch() {}
  onDigested() {}
}
export default Component
