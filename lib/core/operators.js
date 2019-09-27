import React from 'react'
import Observer from '../core-components/observer.jsx'
import Component from './component.js'
import { Store } from './store.js'
import { Model } from './model.js'
import { isFunction, isInstanceOf } from './utils.js'

export function observe(subscribe, unsubscribe) {
  // special for store
  // i.e. observe(store)
  if (isInstanceOf(subscribe, Store) || isInstanceOf(subscribe, Model)) {
    const o = subscribe
    subscribe = dispatch => o.watch('*', dispatch)
    unsubscribe = dispatch => o.unwatch('*', dispatch)
  }

  return function(C) {
    return class extends Component {
      render() {
        const { children, ...props } = this.props
        return (
          <Observer subscribe={subscribe} unsubscribe={unsubscribe} dispatch={this.update}>
            <C {...props}>{children}</C>
          </Observer>
        )
      }
    }
  }
}

export function connect(prop, context) {
  return function(C) {
    return class extends Component {
      render() {
        const { Consumer } = isFunction(context) ? context(props) : context
        const { children, ...props } = this.props
        return (
          <Consumer>
            {value => {
              props[prop] = value
              return <C {...props}>{children}</C>}
            }
          </Consumer>
        )
      }
    }
  }
}

export function inject(prop, define) {
  return function(C) {
    return class extends Component {
      render() {
        const { children, ...props } = this.props
        props[prop] = isFunction(define) ? define(this.props) : define
        return <C {...props}>{children}</C>
      }
    }
  }
}

export function pollute(OriginalComponent, pollute) {
  return function(C) {
    return class extends Component {
      onRender() {
        const { defaultProps } = OriginalComponent
        const hasuse = defaultProps || {}
        const pollutedProps = isFunction(pollute) ? pollute(this.props) : pollute
        const willuse = { ...hasuse, ...pollutedProps }
        OriginalComponent.defaultProps = willuse
        this._originalDefaultProps = defaultProps
      }
      onRendered() {
        const defaultProps = this._originalDefaultProps
        OriginalComponent.defaultProps = defaultProps
      }
      render() {
        const { children, ...props } = this.props
        return <C {...props}>{children}</C>
      }
    }
  }
}

/**
 * @param {*} prop
 * @param {*} Class should be Store or Model, or some class which has watch/unwatch method
 * @param {function} onInit
 * @param {function} onUnmount
 */
export function initialize(prop, Class, onInit, onUnmount) {
  return function(C) {
    return class extends Component {
      onInit() {
        const instance = new Class()
        this[prop] = instance

        if (isFunction(instance.watch)) {
          instance.watch('*', this.update)
        }

        if (isFunction(onInit)) {
          onInit.call(this)
        }
      }
      onUnmount() {
        const instance = this[prop]

        if (isFunction(instance.unwatch)) {
          instance.unwatch('*', this.update)
        }

        if (isFunction(onUnmount)) {
          onUnmount.call(this)
        }

        this[prop] = null
      }
      render() {
        const { children, ...props } = this.props
        props[prop] = this[prop]
        return <C {...props}>{children}</C>
      }
    }
  }
}

export function pipe(wrappers) {
  const items = [...wrappers]
  items.reverse()
  return function(C) {
    return items.reduce((C, wrap) => wrap(C), C)
  }
}
