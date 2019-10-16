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

/**
 * Connect a component with a context
 * @param {*} prop
 * @param {function|ReactContext} context
 */
export function connect(prop, context) {
  return function(C) {
    return class extends Component {
      render() {
        const { children, ...rest } = this.props
        const { Consumer } = isFunction(context) ? context(this.props) : context
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

/**
 * Add a new prop for some component
 * @param {*} prop
 * @param {function|any} define
 */
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

/**
 * Change some component's defaultProps
 * @param {*} component
 * @param {function|object} pollute
 */
export function pollute(component, pollute) {
  return function(C) {
    return class extends Component {
      onInit() {
        const props = isFunction(pollute) ? pollute(this.props) : pollute
        this._pollution = {
          component,
          props,
        }
      }

      render() {
        return <C {...this.props} />
      }
    }
  }
}

/**
 * Change some component's defaultStylesheet
 * @param {*} OriginalComponent
 * @param {stirng|object|array} stylesheet
 */
export function scrawl(component, stylesheet) {
  return function(C) {
    return class extends Component {
      onInit() {
        const _stylesheet = isFunction(stylesheet) ? stylesheet(this.props) : stylesheet
        this._graffiti = {
          component,
          stylesheet: _stylesheet,
        }
      }
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
