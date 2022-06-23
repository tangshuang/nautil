import {
  Component as ReactComponent,
  useRef,
} from 'react'
import {
  each,
  getConstructorOf,
  isArray,
  isInstanceOf,
  isFunction,
  makeKeyChain,
  assign,
  createProxy,
  isEmpty,
  define,
  decideby,
  mixin,
  isObject,
} from 'ts-fns'
import { Ty, Rule, ifexist } from 'tyshemo'
import produce from 'immer'
import { Stream } from './stream.js'

import Style from '../style/style.js'
import ClassName from '../style/classname.js'
import {
  noop,
  isShallowEqual,
  parseClassNames,
  createTwoWayBinding,
  Binding,
  Handling,
  createProxyHandler,
} from '../utils.js'

export class PrimitiveComponent extends ReactComponent {
  constructor(props) {
    super(props)

    this._hooks = []

    // render
    const render = this.render ? this.render.bind(this) : null
    const Render = this.Render ? this.Render.bind(this) : null
    const RenderWrapper = (props) => {
      const hooks = useRef([...this._hooks])
      hooks.current.forEach((hook) => {
        const [fns] = hook
        const deps = fns.map((fn) => fn())
        // eslint-disable-next-line no-param-reassign
        hook[2] = deps
      })

      let tree = null

      if (Render) {
        tree = <Render {...props} />
      } else {
        tree = render()
      }

      tree = this.onRender(tree)

      return tree
    }
    const proxyRender = () => {
      if (!Render && !this._hooks.length) {
        return render()
      }

      const { props } = this
      return <RenderWrapper {...props} />
    }
    define(this, 'render', { value: proxyRender })
  }

  hook(...fns) {
    const fn = fns.length > 1 ? fns.pop() : null
    const hook = [fns, fn]
    this._hooks.push(hook)
    return (...args) => {
      const [, fn, res] = hook

      const out = fn ? fn(...res) : res[0]

      if (typeof out === 'function') {
        return out(...args)
      }

      return out
    }
  }

  onRender(vdom) {
    return vdom
  }
}

export class Component extends PrimitiveComponent {
  constructor(props) {
    super(props)

    // for streams
    this._triggers = []

    // for nextTick
    this._tasksQueue = []
    this._tasksRunner = null

    this._isMounted = false
    this._isUnmounted = false

    // for shouldAffect
    this._effectors = null
    // for shouldUpdate
    this._factors = null

    define(this, 'update', { value: this.update.bind(this) })
    define(this, 'forceUpdate', { value: this.forceUpdate.bind(this) })
    define(this, 'weakUpdate', { value: this.weakUpdate.bind(this) })

    this.__init()
    // state should be declare here
    this.init()

    this._digest(props)

    let $state = null
    define(this, '$state', () => {
      if ($state) {
        return $state
      }
      if (this.state) {
        $state = createTwoWayBinding(this.state, (value, keyPath) => {
          this.update(keyPath, value).then(() => {
            // clear cache each time update
            $state = null
          })
        })
        return $state
      }
      return null
    })

    const setState = this.setState.bind(this)
    define(this, 'setState', {
      value: (...args) => {
        $state = null // clear $state in order to rebuild $state
        return setState(...args)
      },
    })

    this.__inited = true
    each(this, (value, key) => {
      if (isObject(value) && value.$$type === 'offer' && value.fn) {
        this[key] = value.fn()
      }
    })

    this.onInit()
  }

  __init() {
    // should be override
  }

  init() {
    // should be override
  }

  offer(fn) {
    if (!this.__inited) {
      return { $$type: 'offer', fn }
    }
    return fn()
  }

  subscribe(name, affect) {
    const upperCaseName = name.replace(name[0], name[0].toUpperCase())
    this._triggers.push({
      name: upperCaseName,
      affect,
    })
    return this
  }

  unsubscribe(name, affect) {
    const upperCaseName = name.replace(name[0], name[0].toUpperCase())
    this._triggers.forEach((item, i) => {
      if (upperCaseName === item.name && (!affect || affect === item.affect)) {
        this._triggers.splice(i, 1)
      }
    })
    return this
  }

  dispatch(name, data) {
    if (isArray(name)) {
      const names = name
      names.forEach((name) => {
        this.dispatch(name, data)
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
    const { props: PropsTypes, defaultStylesheet, css } = Constructor
    const parsedProps = this.onParseProps(props)
    const { children = null, stylesheet, style, className, ...attrs } = parsedProps

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
    this.className = decideby(() => {
      const classNameQueue = [].concat(defaultStylesheet).concat(stylesheet).concat(className)
      return ClassName.create(classNameQueue)
    })

    // Format stylesheet by using stylesheet, className, style props
    this.style = decideby(() => {
      const styleQueue = [].concat(defaultStylesheet).concat(stylesheet).concat(style)
      return Style.create(styleQueue)
    })

    // generate this.children
    this.children = children

    // createProxy will cost performance, so we only createProxy when attrs are changed in 2 deepth
    if (!this._isMounted || (this._isMounted && !isShallowEqual(finalAttrs, this.attrs, isShallowEqual))) {
      // get original data (without proxied)
      this.attrs = finalAttrs
      // create two-way binding props
      const handlers = createProxyHandler(finalAttrs, (keyPath, value) => {
        const chain = isArray(keyPath) ? [...keyPath] : makeKeyChain(keyPath)
        const root = chain.shift()
        const bindKey = '$' + root
        const bindData = bindingAttrs[bindKey]
        if (!bindData) {
          return
        }

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
      })
      this.$attrs = createProxy(finalAttrs, handlers)
    }

    // import css and transform css rules
    this.cssRules = decideby(() => {
      if (!css) {
        return {}
      }
      const rules = isFunction(css) ? css({
        attrs: this.attrs,
        className: this.className,
        style: this.style,
      }) : css
      return { ...rules }
    })

    // DROP: because we may remove static props when build
    // // make sure the handler can be called in component
    // // i.e. static props = { onChange: false } and developer did not pass onChange
    // if (PropsTypes) {
    //   each(PropsTypes, (value, key) => {
    //     if (/^on[A-Z]/.test(key) && !value && !handlingAttrs[key]) {
    //       handlingAttrs[key] = false
    //     }
    //   })
    // }

    const affect = (name, subject) => {
      this._triggers.forEach((item) => {
        if (name === item.name) {
          subject = item.affect(subject) || subject
          if (process.env.NDOE_ENV !== 'production') {
            Ty.expect(subject).to.be(Stream)
          }
        }
      })
      return subject
    }

    const streams = {}
    const subjects = {}

    /**
     * use the passed handler like onClick to create a stream
     * @param {*} param
     */
    each(handlingAttrs, (param, key) => {
      const name = key.replace('on', '')
      const sign = name + '$'

      if (isInstanceOf(param, Stream)) {
        streams[sign] = param
        return
      }

      const stream = new Stream()

      let subject = stream
      let subscribe = noop

      // key may not exist on props when developers use `onChange: false`
      if (param) {
        const args = isArray(param) ? [...param] : [param]

        subscribe = args.pop() // the last function of passed params will be force treated as subscriber

        if (args.length) {
          subject = subject.pipe(...args.filter(item => isFunction(item)))
        }
      }

      subject = affect(name, subject)
      subject.subscribe(subscribe)

      streams[sign] = stream
    })

    // create streams from static properties
    each(Constructor, ({ value: fn }, key) => {
      if (!isFunction(fn)) {
        return
      }

      // only those begin with upper case
      if (!/^[A-Z].*\$$/.test(key)) {
        return
      }

      const name = key.substr(0, key.length - 1)

      // notice that, it will be oveerided by passed on* stream
      if (key in streams) {
        subjects[name] = [fn, streams[key]]
        return
      }

      if (this[key] && isInstanceOf(this[key], Stream)) {
        streams[key] = this[key]
        return
      }

      const stream = new Stream()
      const subject = affect(name, stream)
      streams[key] = stream
      subjects[name] = [fn, subject]
    }, true)

    // clear previous streams on this
    each(this, (_, key) => {
      // notice that, developers' own component properties should never have UpperCase $ ending words, i.e. Name$, but can have name$
      if (!/^[A-Z].*\$$/.test(key)) {
        return
      }
      // keep the unchanged streams
      if (key in streams && this[key] === streams[key]) {
        return
      }
      // finish stream, free memory
      this[key].complete()
      delete this[key]
    })
    // repatch streams to this
    each(streams, (stream, key) => {
      this[key] = stream
    })
    // subjects should must be called after all streams on this has be created
    each(subjects, ([fn, subject]) => {
      fn.call(this, subject)
    })

    this.onDigested()
  }

  css(...classNames) {
    return parseClassNames(classNames, this.cssRules)
  }

  _affect(fn) {
    const nextEffectors = this.shouldAffect(this.props)
    if (nextEffectors === false) {
      fn()
      this._effectors = false
    }
    else if (nextEffectors === true || this._effectors === null || !isShallowEqual(this._effectors, nextEffectors)) {
      const deferer = Promise.resolve(this.onAffect())
      const runner = Promise.resolve(fn())
      deferer.then(() => runner).then(() => this.onAffected()).catch(noop)
      this._effectors = nextEffectors
    }
    else {
      fn()
    }
  }

  componentDidMount(...args) {
    this._isMounted = true
    this._affect(() => this.onMounted(...args))
    this._runTasks()
  }
  shouldComponentUpdate(nextProps, ...args) {
    const needUpdate = this.shouldUpdate(nextProps, ...args)
    let isNeed = needUpdate

    // if shouldUpdate return array, detect by equal
    if (isArray(needUpdate)) {
      isNeed = !isShallowEqual(this._factors, needUpdate)
      this._factors = needUpdate
    }

    if (!isNeed) {
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
    this._affect(() => this.onUpdated(...args))
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
  shouldAffect() {
    return true
  }
  onAffect() {}
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
          stylesheet: [].concat(nextProps.stylesheet || []).concat(stylesheet || []),
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

  static implement(protos) {
    mixin(this, protos)
    return this
  }
}

export default Component
