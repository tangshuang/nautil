import React from 'react'
import Observer from '../core-components/observer.jsx'
import Component from './component.js'
import { Store } from './store.js'
import { Model } from './model.js'
import { isFunction, isInstanceOf, isString } from './utils.js'
import { Ty } from './types.js'
import { createPollutedComponent } from './_generators.js'

export function observe(subscription, unsubscription) {
  return function(C) {
    return class extends Component {
      render() {
        let subscribe = subscription
        let unsubscribe = unsubscription
        // use a special prop to observe
        // i.e. observe('model') => subscribe = this.attrs.model => subscribe = model.watch('*', dispatch)
        if (isString(subscribe)) {
          subscribe = this.attrs[subscribe]
        }
        // unsubscribe to be a string supporting, which pick a prop
        // i.e. observe('onSubscribe', 'onUnsubscribe')
        if (isFunction(subscribe) && isString(unsubscribe)) {
          unsubscribe = this.attrs[unsubscribe]
        }

        // special for store
        // i.e. observe(store)
        const isObservable = isInstanceOf(subscribe, Store)
          || isInstanceOf(subscribe, Model)
          || isInstanceOf(subscribe.__store__, Store)
          || isInstanceOf(subscribe.__model__, Model)
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

        if (process.env.NODE_ENV !== 'production') {
          Ty.expect({ subscribe, unsubscribe }).to.be({
            subscribe: Function,
            unsubscribe: Function,
          })
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
 * Connect a component with a context
 * @param {*} prop
 * @param {function|ReactContext} context
 */
export function connect(prop, context) {
  return function(C) {
    return class extends Component {
      render() {
        const { children, ...props } = this.props
        const { Consumer } = isFunction(context) ? context(this.attrs) : context
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
        props[prop] = isFunction(define) ? define(this.attrs) : define
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
  const PollutedComponent = createPollutedComponent({ component, pollute, type: 'pollutedProps' })
  return function(C) {
    return class extends PollutedComponent {
      render() {
        return <C {...this.props} />
      }
    }
  }
}

/**
 * Change some component's defaultStylesheet
 * @param {*} component
 * @param {stirng|object|array} stylesheet
 */
export function scrawl(component, stylesheet) {
  const PollutedComponent = createPollutedComponent({ component, pollute: stylesheet, type: 'scrawledStyles' })
  return function(C) {
    return class extends PollutedComponent {
      render() {
        return <C {...this.props} />
      }
    }
  }
}

/**
 * Initialize a Class when the component initialize
 * @param {*} prop
 * @param {*} Class should be Store or Model, or some class which has watch/unwatch method
 * @param {...any} args the parameters which passed into the class constructor when initialize
 */
export function initialize(prop, Class, ...args) {
  return function(C) {
    return class extends Component {
      onInit() {
        const instance = new Class(...args)
        instance.___time = Date.now()
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

/**
 * Conbime operating, with order
 * @param {*} wrappers
 */
export function pipe(wrappers) {
  const items = [...wrappers]
  items.reverse()
  return function(C) {
    return items.reduce((C, wrap) => wrap(C), C)
  }
}

/**
 * Batch operating
 * @param {*} operate
 * @param {*} items
 */
export function multiple(operate, items) {
  const wrappers = items.map((item) => operate.apply(null, item))
  return pipe(wrappers)
}
