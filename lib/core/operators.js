import React from 'react'
import Observer from '../core-components/observer.jsx'
import Component from './component.js'
import { Store } from './store.js'
import { Model } from './model.js'
import { isFunction, isInstanceOf, isString } from './utils.js'
import { Ty } from './types.js'

export function observe(subscribe, unsubscribe) {
  return function(C) {
    return class extends Component {
      render() {
        const { children, ...rest } = this.props

        // use a special prop to observe
        // i.e. observe('model') => subscribe = this.props.model => subscribe = model.watch('*', dispatch)
        if (isString(subscribe)) {
          subscribe = rest[subscribe]
        }
        // unsubscribe to be a string supporting, which pick a prop
        // i.e. observe('onSubscribe', 'onUnsubscribe')
        if (isFunction(subscribe) && isString(unsubscribe)) {
          unsubscribe = rest[unsubscribe]
        }

        // special for store
        // i.e. observe(store)
        if (isInstanceOf(subscribe, Store) || isInstanceOf(subscribe, Model)) {
          const o = subscribe
          const k = isString(unsubscribe) ? unsubscribe : '*'
          subscribe = dispatch => o.watch(k, dispatch)
          unsubscribe = dispatch => o.unwatch(k, dispatch)
        }

        if (process.env.NODE_ENV !== 'production') {
          Ty.expect({ subscribe, unsubscribe }).to.be({
            subscribe: Function,
            unsubscribe: Function,
          })
        }

        return (
          <Observer subscribe={subscribe} unsubscribe={unsubscribe} dispatch={this.update}>
            <C {...rest}>{children}</C>
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
        const { children, ...rest } = this.props
        return (
          <Consumer>
            {value => {
              rest[prop] = value
              return <C {...rest}>{children}</C>}
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
        const { children, ...rest } = this.props
        rest[prop] = isFunction(define) ? define(this.props) : define
        return <C {...rest}>{children}</C>
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
        const { children, ...rest } = this.props
        return <C {...rest}>{children}</C>
      }
    }
  }
}

/**
 * @param {*} prop
 * @param {*} Class should be Store or Model, or some class which has watch/unwatch method
 */
export function initialize(prop, Class, ...args) {
  return function(C) {
    return class extends Component {
      onInit() {
        const instance = new Class(...args)
        this[prop] = instance
      }
      onUnmount() {
        this[prop] = null
      }
      render() {
        const { children, ...rest } = this.props
        rest[prop] = this[prop]
        return <C {...rest}>{children}</C>
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
