import React, { isValidElement } from 'react'
import {
  each,
  getConstructorOf,
  isArray,
  map,
  isInstanceOf,
  isFunction,
  makeKeyChain,
  assign,
  createProxy,
  isEmpty,
  define,
} from 'ts-fns'
import { Ty, Rule, ifexist } from 'tyshemo'
import produce from 'immer'
import Stream from './stream.js'

import Style from './style/style.js'
import ClassName from './style/classname.js'
import { Binding, Handling } from './types.js'
import { noop, isRef, isShallowEqual } from './utils.js'

export class PrimitiveComponent extends React.Component {
  constructor(props) {
    super(props)

    // render
    const render = this.render ? this.render.bind(this) : null
    const Render = this.Render ? this.Render.bind(this) : null
    const proxyRender = () => {
      const props = this.props

      let tree = null

      if (Render) {
        tree = <Render {...props} />
      }
      else {
        tree = render()
      }

      const polluted = this._polluteRenderTree(tree)
      return polluted
    }
    define(this, 'render', { value: proxyRender })
  }

  _getPollutedComponents() {
    let pollutedComponents = this._pollutedComponents || []

    const fiber = this._reactInternalFiber || this._reactInternals
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
    return pollutedComponents
  }

  _polluteRenderTree(tree) {
    const pollutedComponents = this._getPollutedComponents()
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

      return React.cloneElement(node, { ...pollutedProps }, subtree)
    }
    const modify = (tree) => {
      if (isArray(tree)) {
        const modifed = React.Children.map(tree, map)
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

export class Component extends PrimitiveComponent {
  constructor(props) {
    super(props)

    this._effectors = []

    this._tasksQueue = []
    this._tasksRunner = null

    this._isMounted = false
    this._isUnmounted = false

    define(this, 'update', { value: this.update.bind(this) })
    define(this, 'forceUpdate', { value: this.forceUpdate.bind(this) })

    this.init()

    this._digest(props)

    this.$state = this.state && createProxy(this.state, {
      writable: (keyPath, value) => {
        this.update(keyPath, value)
        return false
      },
    })

    this.onInit()
  }

  init() {
    // should be override
  }

  on(name, affect) {
    const upperCaseName = name.replace(name[0], name[0].toUpperCase())
    this._effectors.push({
      name: upperCaseName,
      affect,
    })
    return this
  }

  off(name, affect) {
    const upperCaseName = name.replace(name[0], name[0].toUpperCase())
    this._effectors.forEach((item, i) => {
      if (upperCaseName === item.name && (!affect || affect === item.affect)) {
        this._effectors.splice(i, 1)
      }
    })
    return this
  }

  emit(name, data) {
    if (isArray(name)) {
      const names = name
      names.forEach((name) => {
        this.emit(name, data)
      })
      return this
    }

    const upperCaseName = name.replace(name[0], name[0].toUpperCase())
    const stream = this[upperCaseName + '$']
    if (!stream) {
      return this
    }

    this[upperCaseName + '$'].next(data)
    return this
  }

  weakUpdate() {
    return new Promise((callback) => {
      this.setState({}, callback)
    })
  }

  forceUpdate() {
    return new Promise((callback) => {
      if (!this._isMounted || this._isUnmounted) {
        callback()
        return
      }

      this.onUpdate(this.props, this.state)
      this._digest(this.props)
      super.forceUpdate(callback)
    })
  }

  update(...args) {
    return new Promise((callback) => {
      if (!this._isMounted || this._isUnmounted) {
        callback()
        return
      }

      if (args.length === 2) {
        const [keyPath, fn] = args
        const next = produce(this.state, state => { assign(state, keyPath, fn) })
        this.setState(next, callback)
      }
      else if (args.length === 1) {
        const arg = args[0]
        if (typeof arg === 'function') {
          const next = produce(this.state, state => { arg(state) })
          // we can delete a property of state in fn
          const existingKeys = Object.keys(this.state)
          existingKeys.forEach((key) => {
            if (!(key in next)) {
              next[key] = void 0
            }
          })
          this.setState(next, callback)
        }
        else if (typeof arg && typeof arg === 'object') {
          this.setState(arg, callback)
        }
        else if (arg === true) {
          this.forceUpdate(callback)
        }
        else {
          this.setState({}, callback)
        }
      }
      else {
        this.setState({}, callback)
      }
    })
  }

  nextTick(fn, ...args) {
    this._tasksQueue.push({ fn, args })
  }

  _runTasks() {
    // dont run two runner at the same time
    if (this._tasksRunner) {
      return
    }

    const run = () => {
      let start = Date.now()
      const consume = () => {
        if (!this._tasksQueue.length) {
          clearTimeout(this._tasksRunner)
          return
        }

        const { fn, args } = this._tasksQueue.shift()
        fn(...args)

        const now = Date.now()
        // splice time by 16ms
        // when a function call is more than 8ms, tasks should be holded for 8ms to wait other function calls
        if (now - start > 8) {
          this._tasksRunner = setTimeout(run, 8)
        }
        else {
          this._tasksRunner = setTimeout(consume, 0)
        }
      }
      consume()
    }
    run()
  }

  _digest(props) {
    const Constructor = getConstructorOf(this)
    const { props: PropsTypes, defaultStylesheet } = Constructor
    const parsedProps = this.onParseProps(props)
    const { children, stylesheet, style, className, ...attrs } = parsedProps

    // normal attrs
    const finalAttrs = {}
    // two-way binding:
    const bindingAttrs = {}
    // handlers
    const handlingAttrs = {}

    // prepare for attrs data
    each(attrs, (data, key) => {
      if (/^\$[a-zA-Z]/.test(key)) {
        bindingAttrs[key] = data
        finalAttrs[key.substr(1)] = data[0] // $show={[value, update]} => finalAttrs[show]=value
      }
      else if (/^on[A-Z]/.test(key)) {
        handlingAttrs[key] = data
      }
      else {
        finalAttrs[key] = data
      }
    })

    // prepare for data type checking
    if (process.env.NODE_ENV !== 'production' && PropsTypes) {
      const checkPropTypes = (propTypes) => {
        const finalTypes = {}
        const bindingTypes = {}
        const handlingTypes = {}

        each(attrs, (data, key) => {
          if (/^\$[a-zA-Z]/.test(key)) {
            if (!bindingTypes[key]) {
              bindingTypes[key] = Binding
            }
          }
          else if (/^on[A-Z]/.test(key)) {
            if (!handlingTypes[key]) {
              handlingTypes[key] = Handling
            }
          }
        })

        each(propTypes, (type, key) => {
          if (/^\$[a-zA-Z]/.test(key)) {
            const attr = key.substr(1)
            finalTypes[attr] = type
            bindingTypes[key] = isInstanceOf(type, Rule) && type.name === 'ifexist' ? ifexist(Binding) : Binding
          }
          // onChange: true -> required
          // onChange: false -> not reuqired
          else if (/^on[A-Z]/.test(key)) {
            handlingTypes[key] = !type ? ifexist(Handling) : Handling
          }
          else {
            finalTypes[key] = type
          }
        })

        Ty.expect(bindingAttrs).to.match(bindingTypes)
        Ty.expect(handlingAttrs).to.be(handlingTypes)

        // don't check again when update and the same prop has same value
        if (this._isMounted) {
          const currentProps = this.props
          each(finalAttrs, (value, key) => {
            if ((isEmpty(currentProps[key]) && isEmpty(value)) || currentProps[key] === value) {
              delete finalTypes[key]
            }
          })
        }

        Ty.expect(finalAttrs).to.match(finalTypes)
      }
      if (isFunction(PropsTypes)) {
        this.nextTick(() => {
          const propTypes = PropsTypes()
          checkPropTypes(propTypes)
        })
      }
      else {
        checkPropTypes(PropsTypes)
      }
    }

    // format stylesheet by using stylesheet, className, style props
    const classNameQueue = [].concat(defaultStylesheet).concat(stylesheet).concat(className)
    this.className = ClassName.create(classNameQueue)

    // Format stylesheet by using stylesheet, className, style props
    const styleQueue = [].concat(defaultStylesheet).concat(stylesheet).concat(style)
    this.style = Style.create(styleQueue)

    this.children = children

    // createProxy will cost performance, so we only createProxy when attrs are changed in 2 deepth
    if (!this._isMounted || (this._isMounted && !isShallowEqual(finalAttrs, this.attrs, isShallowEqual))) {
      // get original data (without proxied)
      this.attrs = finalAttrs
      // create two-way binding props
      this.$attrs = createProxy(finalAttrs, {
        writable(keyPath, value) {
          const chain = isArray(keyPath) ? [...keyPath] : makeKeyChain(keyPath)
          const root = chain.shift()
          const bindKey = '$' + root
          const bindData = bindingAttrs[bindKey]
          if (bindData) {
            const [current, update] = bindData
            if (chain.length) {
              const next = produce(current, data => {
                assign(data, chain, value)
              })
              update(next, current)
            }
            else {
              update(value, current)
            }
          }
          return false
        },
        disable(_, value) {
          return isValidElement(value) || isRef(value)
        },
      })
    }

    // make sure the handler can be called in component
    // i.e. static props = { onChange: false } and developer did not pass onChange
    if (PropsTypes) {
      each(PropsTypes, (value, key) => {
        if (/^on[A-Z]/.test(key) && !value && !handlingAttrs[key]) {
          handlingAttrs[key] = false
        }
      })
    }
    /**
     * use the passed handler like onClick to create a stream
     * @param {*} param
     */
    const streams = {}
    each(handlingAttrs, (param, key) => {
      const name = key.replace('on', '')
      const sign = name + '$'

      if (isInstanceOf(param, Stream)) {
        streams[sign] = param
        return
      }

      let subject = new Stream()
      let subscribe = noop

      // key may not exist on props when developers use `onChange: false`
      if (param) {
        const args = isArray(param) ? [...param] : [param]

        subscribe = args.pop() // the last function of passed params will be force treated as subscriber

        if (args.length) {
          subject = subject.pipe(...args.filter(item => isFunction(item)))
        }
      }

      this._effectors.forEach((item) => {
        if (name === item.name) {
          subject = item.affect(subject) || subject
          if (process.env.NDOE_ENV !== 'production') {
            Ty.expect(subject).to.be(Stream)
          }
        }
      })

      subject.subscribe(subscribe)

      streams[sign] = subject
    })

    each(this, (_, key) => {
      // notice that, developers' own component properties should never have UpperCase $ ending words, i.e. Name$, but can have name$
      if (/^[A-Z].*\$$/.test(key)) {
        // keep the unchanged streams
        if (key in streams && this[key] === streams[key]) {
          return
        }
        // finish stream, free memory
        this[key].complete()
        delete this[key]
      }
    })
    each(streams, (stream, name) => {
      this[name] = stream
    })

    this.onDigested()
  }

  componentDidMount(...args) {
    this._isMounted = true
    this.onMounted(...args)
    this.onAffected()
    this._runTasks()
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
    this.onAffected()
    this._runTasks()
  }
  componentWillUnmount(...args) {
    this.onUnmount(...args)
    // complete all streams, so that async operations will never emit
    each(this, (value, key) => {
      if (/^[A-Z].*\$$/.test(key)) {
        this[key].complete() // finish stream, free memory
        delete this[key]
      }
    })
    // dont run any task any more
    this._tasksQueue.length = 0
    clearTimeout(this._tasksRunner)
    // tag unmounted
    this._isUnmounted = true
    this._isMounted = false
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
  onAffected() {}
  onParseProps(props) {
    return props
  }

  static extend(overrideProps) {
    const Constructor = this
    return class extends Constructor {
      _digest(nextProps) {
        const { stylesheet, props, deprecated } = isFunction(overrideProps) ? overrideProps(nextProps) : overrideProps
        const useProps = {
          ...nextProps,
          ...(props || {}),
          stylesheet: [].concat(nextProps.stylesheet || []).concat(stylesheet || [])
        }
        if (deprecated) {
          each(deprecated, (key) => {
            delete useProps[key]
          })
        }
        super._digest(useProps)
      }
    }
  }
}
export default Component
