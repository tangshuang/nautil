import React, { createContext } from 'react'
import { Store, Model } from 'tyshemo'
import {
  isFunction,
  isInstanceOf,
  isString,
} from 'ts-fns'

import Component from '../component.js'
import Observer from '../components/observer.jsx'

const sharedContext = createContext(null)

export function observe(subscription, unsubscription) {
  return function(C) {
    return class extends Component {
      render() {
        let subscribe = subscription
        let unsubscribe = unsubscription
        // use a special prop to observe
        // i.e. observe('model') => subscribe = this.props.model => subscribe = model.watch('*', dispatch)
        if (isString(subscribe)) {
          subscribe = this.props[subscribe]
        }
        // unsubscribe to be a string supporting, which pick a prop
        // i.e. observe('onSubscribe', 'onUnsubscribe')
        if (isFunction(subscribe) && isString(unsubscribe)) {
          unsubscribe = this.props[unsubscribe]
        }

        // special for store
        // i.e. observe(store)
        const isObservable = isInstanceOf(subscribe, Store) || isInstanceOf(subscribe, Model)
        if (isObservable) {
          const o = subscribe
          const k = isString(unsubscribe) ? unsubscribe : '*'
          subscribe = dispatch => {
            o.watch(k, dispatch)
          }
          unsubscribe = dispatch => {
            o.unwatch(k, dispatch)
          }
        }

        return (
          <Observer subscribe={subscribe} unsubscribe={unsubscribe} dispatch={this.update}>
            <C {...this.props} />
          </Observer>
        )
      }
    }
  }
}

/**
 * Use Provider to wrapper inner component
 * @param {*} prop
 * @param {*} context
 */
export function provide(prop, context = sharedContext) {
  return function(C) {
    return class extends Component {
      render() {
        const { children, ...props } = this.props
        const { Provider } = isFunction(context) ? context(this.props) : context
        const value = props[prop]
        return (
          <Provider value={value}>
            <C {...props}>{children}</C>
          </Provider>
        )
      }
    }
  }
}

/**
 * Connect a component with a context
 * @param {*} prop
 * @param {function|ReactContext} context
 */
export function connect(prop, context = sharedContext) {
  return function(C) {
    return class extends Component {
      render() {
        const { children, ...props } = this.props
        const { Consumer } = isFunction(context) ? context(this.props) : context
        return (
          <Consumer>
            {value => {
              props[prop] = value
              return <C {...props}>{children}</C>
            }}
          </Consumer>
        )
      }
    }
  }
}

/**
 * Add a new prop for some component
 * @param {*} prop
 * @param {function|any} define
 */
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

/**
 * Change some component's defaultProps
 * @param {*} component
 * @param {function|object} pollute
 */
export function pollute(component, pollute) {
  return function(C) {
    return class extends Component {
      onInit() {
        const pollutedProps = isFunction(pollute) ? pollute(this.props) : pollute
        this._pollutedComponents = [
          { component, props: pollutedProps }
        ]
      }
      render() {
        return <C {...this.props} />
      }
    }
  }
}

/**
 * Initialize a Constructor when the component initialize
 * @param {*} prop
 * @param {*} Constructor should be Store or Model, or some class which has watch/unwatch method
 * @param {...any} args the parameters which passed into the class constructor when initialize
 */
export function initialize(prop, Constructor, ...args) {
  return function(C) {
    return class extends Component {
      onInit() {
        const instance = new Constructor(...args)
        this[prop] = instance
      }
      onUnmount() {
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
