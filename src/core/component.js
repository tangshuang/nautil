import React from 'react'
import {
  each,
  getConstructorOf,
  isArray,
} from 'ts-fns'
import { Observable } from 'rxjs'
import { Ty } from 'tyshemo'

import {
  buildAttrs,
  buildClassName,
  buildStyle,
  buildStreams,
} from './utils.js'

export class PrimitiveComponent extends React.Component {
  _getPollutedComponents() {
    let pollutedComponents = this._pollutedComponents || []

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

  render() {
    const tree = super.render()
    const polluted = this._polluteRenderTree(tree)
    return polluted
  }
}

export class Component extends PrimitiveComponent {
  constructor(props) {
    super(props)

    this._jammers = []
    this.onInit()
    this._digest(props)
  }

  bind(name, affect) {
    this._jammers.push({ name, affect })
  }

  unbind(name, affect) {
    this._jammers.forEach((item, i) => {
      if (name === item.name && (!affect || affect === item.affect)) {
        this._jammers.splice(i, 1)
      }
    })
  }

  emit(name, data) {
    const stream = this[name + '$']
    if (!stream) {
      return
    }
    this[name + '$'].next(data)
  }

  forceUpdate() {
    this.onUpdate(this.props, this.state)
    this._digest(this.props)
    return super.forceUpdate()
  }

  update() {
    return this.setState({})
  }

  _digest(props) {
    const Constructor = getConstructorOf(this)

    this.attrs = buildAttrs(props, Constructor)
    this.className = buildClassName(props, Constructor)
    this.style = buildStyle(props, Constructor)
    this.children = props.children

    const streams = buildStreams(props, Constructor)
    each(this, (value, key) => {
      if (/^on[A-Z].*\$$/.test(key)) {
        const name = key.replace('on', '')
        delete this[name + '$']
      }
    })
    each(streams, (value, key) => {
      const name = key.replace('on', '')
      this._jammers.forEach((item) => {
        if (name === item.name) {
          value = item.affect(value) || value
          if (process.env.NDOE_ENV !== 'production') {
            Ty.expect(value).to.be(Observable)
          }
        }
      })
      this[name + '$'] = value
    })

    this.onDigested()
  }

  componentDidMount(...args) {
    this.onMounted(...args)
    this.onRendered()
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
  onRendered() {}
}
export default Component
