import React from 'react'
import { each, map, getConstructor, isArray, isString, isObject, throttle, createHandledStream, isInstanceOf } from './utils.js'
import { Ty } from './types.js'
import Transfrom from '../style/transform.js'
import Store from './store.js'

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
    const { props: PropsType } = Constructor

    // data type checking
    if (PropsType) {
      Ty.expect(props).to.match(PropsType)
    }

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
        delete attrs[key]
        this[key + '$'] = createHandledStream(value)
      }
    })

    // bind attrs
    const watchers = []
    each(attrs, (info, key) => {
      if (key.indexOf('$') === 0) {
        delete attrs[key]
        key = key.substr(1)
        // $show={[state, 'show']} or $show={state}
        const [state, prop] = (isArray(info) ? info : [info, key])
        attrs[key] = state[prop]
        watchers.push({ key, prop, state })
      }
    })
    const store = new Store(attrs)
    watchers.forEach(({ key, prop, state }) => {
      store.watch(key, (value) => {
        state[prop] = value
      })
    })
    this.attrs = store.state
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
    this.onRender()
    this.onMount(...args)
  }
  componentDidMount(...args) {
    this.onMounted(...args)
    this.onRendered()
  }
  UNSAFE_componentWillUpdate(...args) {
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
