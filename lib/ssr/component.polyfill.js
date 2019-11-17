import { PrimitiveComponent } from '../core/component.js'
import { Component as ReactComponent } from 'react'
import {
  cloneElement,
  mapChildren,
  isArray,
  isFunction,
  isInheritedOf,
  attachPrototype,
  attachPrototypeEntry,
} from '../core/utils.js'

attachPrototype(PrimitiveComponent, {
  _getPollutedComponents() {
    let pollutedComponents = this._pollutedComponents || []

    // there is no fiber in SSR
    // pollute is invoked in onInit in SSR, look into operators.js
    const { propofpollutedcomponents = [] } = this.props
    pollutedComponents = [].concat(propofpollutedcomponents).concat(pollutedComponents)

    return pollutedComponents
  },
})

attachPrototypeEntry(PrimitiveComponent, {
  _polluteRenderTree(tree) {
    const pollutedComponents = this._getPollutedComponents()

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
        class FunctionComponent extends PrimitiveComponent {
          render() {
            return type(this.props)
          }
        }
        node = <FunctionComponent {...props} />
        props = node.props
      }
      else if (typeof type === 'function' && isInheritedOf(type, ReactComponent)) {
        const _render = type.prototype.render
        const _polluteRenderTree = PrimitiveComponent.prototype._polluteRenderTree
        type.prototype.render = function() {
          const tree = _render.call(this)
          const polluted = _polluteRenderTree.call(this, tree)
          return polluted
        }
      }

      const { children } = props
      const subtree = modify(children)
      const polluted = typeof type === 'string' ? { propofpollutedcomponents: undefined } : { propofpollutedcomponents: pollutedComponents }

      const clonedNode = cloneElement(node, polluted, subtree)
      return clonedNode
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
    const pollutedTree = modify(tree)

    return [pollutedTree]
  },
})
