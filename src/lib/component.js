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
} from 'ts-fns'
import { Ty, Rule, ifexist } from 'tyshemo'
import produce from 'immer'
import Stream from './stream.js'

import Style from './style/style.js'
import ClassName from './style/classname.js'
import { Binding, Handling } from './types.js'
import { noop } from './utils.js'

export class PrimitiveComponent extends React.Component {
  constructor(props) {
    super(props)

    // render
    const render = this.render ? this.render.bind(this) : null
    const renderFrom = this.renderFrom ? this.renderFrom.bind(this) : null
    const Render = this.Render ? this.Render.bind(this) : null
    Object.defineProperty(this, 'render', {
      value: () => {
        const props = this.props

        let tree = null

        if (renderFrom) {
          const resource = renderFrom(props)
          tree = PrimitiveComponent.createComponentFrom(resource)
        }
        else if (Render) {
          tree = <Render {...props} />
        }
        else {
          tree = render()
        }

        const polluted = this._polluteRenderTree(tree)
        return polluted
      }
    })
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

  static createComponentFrom(resource) {
    const create = (resource) => {
      const [type, props, ...children] = resource
      const desc = [type === null ? React.Fragment : type, props]
      if (children.length) {
        const subs = children.map((child) => {
          if (isArray(child)) {
            return create(child)
          }
          else {
            return child
          }
        })
        desc.push(...subs)
      }
      const element = React.createElement(...desc)
      return element
    }
    return create(resource)
  }
}

export class Component extends PrimitiveComponent {
  constructor(props) {
    super(props)

    this._effectors = []
    this._tasksQueue = []
    this._isMounted = false
    this._isUnmounted = false

    this.update = this.update.bind(this)
    this.forceUpdate = this.forceUpdate.bind(this)

    this.onInit()
    this._digest(props)
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

  forceUpdate() {
    this.onUpdate(this.props, this.state)
    this._digest(this.props)
    return super.forceUpdate()
  }

  update(...args) {
    if (args.length === 2) {
      const [keyPath, fn] = args
      const next = produce(this.state, state => { assign(state, keyPath, fn) })
      return this.setState(next)
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
        return this.setState(next)
      }
      else if (typeof arg && typeof arg === 'object') {
        return this.setState(arg)
      }
      else if (arg === true) {
        return this.forceUpdate()
      }
      else {
        return this.setState({})
      }
    }
    else {
      return this.setState({})
    }
  }

  nextTick(fn, ...args) {
    this._tasksQueue.push({ fn, args })
  }

  _runTasks() {
    let count = 0
    const run = () => {
      setTimeout(() => {
        if (!this._tasksQueue.length) {
          return
        }
        if (count > 20) {
          return
        }

        const { fn, args } = this._tasksQueue.shift()
        fn(...args)

        count ++

        run()
      }, 8)
    }
    run()
  }

  _digest(props) {
    const Constructor = getConstructorOf(this)
    const { props: PropsTypes, propsCheckAsync, defaultStylesheet } = Constructor
    const parsedProps = this.onParseProps(props)
    const { children, stylesheet, style, className, ...attrs } = parsedProps

    // normal attrs
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
        each(PropsTypes, (type, key) => {
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
      }
    }

    // prepare for attrs data
    each(attrs, (data, key) => {
      if (/^\$[a-zA-Z]/.test(key)) {
        const attr = key.substr(1)

        // not a required prop, check its data type with Binding
        if (process.env.NODE_ENV !== 'production') {
          if (!bindingTypes[key]) {
            bindingTypes[key] = Binding
          }
        }

        bindingAttrs[key] = data
        finalAttrs[attr] = data[0] // $show={[value, update]} => finalAttrs[show]=value
      }
      else if (/^on[A-Z]/.test(key)) {
        // for type checking
        if (process.env.NODE_ENV !== 'production') {
          if (!handlingTypes[key]) {
            handlingTypes[key] = Handling
          }
        }

        handlingAttrs[key] = data
      }
      else {
        finalAttrs[key] = data
      }
    })

    // check data type now
    if (process.env.NODE_ENV !== 'production') {
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

      if (propsCheckAsync) {
        this.nextTick((finalAttrs, finalTypes) => Ty.expect(finalAttrs).to.match(finalTypes), finalAttrs, finalTypes)
      }
      else {
        Ty.expect(finalAttrs).to.match(finalTypes)
      }
    }

    // format stylesheet by using stylesheet, className, style props
    const classNameQueue = [].concat(defaultStylesheet).concat(stylesheet).concat(className)
    this.className = ClassName.create(classNameQueue)

    // Format stylesheet by using stylesheet, className, style props
    const styleQueue = [].concat(defaultStylesheet).concat(stylesheet).concat(style)
    this.style = Style.create(styleQueue)

    this.children = children

    // create two-way binding props
    this.attrs = createProxy(finalAttrs, {
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
        return isValidElement(value)
      },
    })

    /**
     * use the passed handler like onClick to create a stream
     * @param {*} param
     */
    const streams = map(handlingAttrs, (param, key) => {
      if (isInstanceOf(param, Stream)) {
        return param
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

      const name = key.replace('on', '')
      this._effectors.forEach((item) => {
        if (name === item.name) {
          subject = item.affect(subject) || subject
          if (process.env.NDOE_ENV !== 'production') {
            Ty.expect(subject).to.be(Stream)
          }
        }
      })

      subject.subscribe(subscribe)

      return subject
    })
    each(this, (_, key) => {
      // notice that, developers' own component properties should never have UpperCase $ ending words, i.e. Name$, but can have name$
      if (/^[A-Z].*\$$/.test(key)) {
        this[key].complete() // finish stream, free memory
        delete this[key]
      }
    })
    each(streams, (stream, key) => {
      const name = key.substr(2) + '$'
      this[name] = stream
    })

    this.onDigested()
  }

  componentDidMount(...args) {
    this._isMounted = true
    this.onMounted(...args)
    this.onRendered()
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
    this.onRendered()
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
    this._isUnmounted = true
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
  onRendered() {}
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
