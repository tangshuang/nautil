import { Component as ReactComponent } from 'react'
import {
  each,
  getConstructor,
  cloneElement,
  mapChildren,
  isArray,
} from './utils.js'
import {
  useAttrs,
  useStreams,
  useStyle,
  useClassName,
} from '../core/hooks.js'

export class PrimitiveComponent extends ReactComponent {
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

export class Component extends PrimitiveComponent {
  constructor(props) {
    super(props)

    // update
    this.update = () => this.setState({})
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

    this.attrs = useAttrs(props, Constructor)
    this.className = useClassName(props, Constructor)
    this.style = useStyle(props, Constructor)
    this.children = props.children

    const streams = useStreams(props, Constructor)
    each(this, (value, key) => {
      if (/^on[A-Z].*\$$/.test(key)) {
        delete this[key]
      }
    })
    each(streams, (value, key) => {
      this[key + '$'] = value
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
