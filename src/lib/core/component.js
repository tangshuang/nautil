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
  constructor(props) {
    super(props)

    // render
    const _render = this.render.bind(this)
    this.render = () => {
      const tree = _render()
      const polluted = this._polluteRenderTree(tree)
      return polluted
    }
  }

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

    this._jammers = []
    this.update = this.update.bind(this)
    this.forceUpdate = this.forceUpdate.bind(this)

    this.onInit()
    this._digest(props)
  }

  on(name, affect) {
    const upperCaseName = name.replace(name[0], name[0].toUpperCase())
    this._jammers.push({
      name: upperCaseName,
      affect,
    })
    return this
  }

  off(name, affect) {
    const upperCaseName = name.replace(name[0], name[0].toUpperCase())
    this._jammers.forEach((item, i) => {
      if (upperCaseName === item.name && (!affect || affect === item.affect)) {
        this._jammers.splice(i, 1)
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

  update() {
    return this.setState({})
  }

  _digest(props) {
    const parsedProps = this.onParseProps(props)

    const Constructor = getConstructorOf(this)

    this.attrs = buildAttrs(parsedProps, Constructor)
    this.className = buildClassName(parsedProps, Constructor)
    this.style = buildStyle(parsedProps, Constructor)
    this.children = parsedProps.children

    const streams = buildStreams(parsedProps, Constructor, (stream, key) => {
      const name = key.replace('on', '')
      this._jammers.forEach((item) => {
        if (name === item.name) {
          stream = item.affect(stream) || stream
          if (process.env.NDOE_ENV !== 'production') {
            Ty.expect(stream).to.be(Observable)
          }
        }
      })
      return stream
    })
    each(this, (value, key) => {
      if (/^[A-Z].*\$$/.test(key)) {
        delete this[key + '$']
      }
    })
    each(streams, (stream, key) => {
      const name = key.replace('on', '')
      this[name + '$'] = stream
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
  onParseProps(props) {
    return props
  }
}
export default Component
