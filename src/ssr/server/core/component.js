import { cloneElement } from 'react'
import { mixin, isFunction, isInheritedOf } from 'ts-fns'
import { PrimitiveComponent, Component } from '../../../lib/component.js'

const _polluteRenderTree = PrimitiveComponent.prototype._polluteRenderTree
mixin(PrimitiveComponent, class {
  _getPollutedComponents() {
    const _pollutedComponents = this._pollutedComponents || []
    // there is no fiber in SSR
    // pollute is invoked in onInit in SSR, look into operators.js
    const { pollutedcomponents = [] } = this.props
    const pollutedComponents = [].concat(_pollutedComponents).concat(pollutedcomponents)
    return pollutedComponents
  }
  _polluteRenderTree(tree) {
    const pollutedComponents = this._getPollutedComponents()

    // pollute children tree by using parent passed prop
    const map = (node) => {
      if (!node || typeof node !== 'object') {
        return node
      }

      let { type, props } = node
      if (!type || typeof type !== 'function') {
        return cloneElement(node, { pollutedcomponents: undefined })
      }

      // when meet a Function Component, wrapper it with class component
      // so that we can use pollute
      if (isFunction(type) && !isInheritedOf(type, ReactComponent)) {
        const That = type
        class FunctionComponent extends PrimitiveComponent {
          render() {
            return <That {...this.props} />
          }
        }
        node = <FunctionComponent {...props} />
        props = node.props
      }
      // primitive react component
      // which is not extended from Nautil.Component
      else if (typeof type === 'function' && isInheritedOf(type, ReactComponent) && !isInheritedOf(type, PrimitiveComponent)) {
        const TargetComponent = type
        const _render = TargetComponent.prototype.render
        const _polluteRenderTree = PrimitiveComponent.prototype._polluteRenderTree
        TargetComponent.prototype.render = function() {
          const tree = _render.call(this)
          const polluted = _polluteRenderTree.call(this, tree)
          return polluted
        }
      }

      const { children } = props
      const subtree = modify(children)
      const polluted = typeof type === 'string' ? { pollutedcomponents: undefined } : { pollutedcomponents: pollutedComponents }

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

    return _polluteRenderTree([pollutedTree])
  }
})

export { Component }
export default Component
