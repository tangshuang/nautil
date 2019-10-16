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
 * @param {*} OriginalComponent
 * @param {function|object} pollute
 */
export function pollute(OriginalComponent, pollute) {
  return function(C) {
    return class extends Component {
      pollute() {
        const { defaultProps } = OriginalComponent
        const hasuse = defaultProps || {}
        const pollutedProps = isFunction(pollute) ? pollute(this.props) : pollute
        const willuse = { ...hasuse, ...pollutedProps }
        OriginalComponent.defaultProps = willuse
        this['_originalDefaultPropsOf' + OriginalComponent.name] = defaultProps
      }
      unpollute() {
        const defaultProps = this['_originalDefaultPropsOf' + OriginalComponent.name]
        OriginalComponent.defaultProps = defaultProps
        delete this['_originalDefaultPropsOf' + OriginalComponent.name]
      }

      onMount() {
        this.unpollute()
      }

      onUpdate() {
        this.unpollute()
      }

      render() {
        const { children, ...rest } = this.props
        this.pollute()
        const output = <C {...rest}>{children}</C>
        this.unpollute()
        return output
      }
    }
  }
}

/**
 * Change some component's defaultStylesheet
 * @param {*} OriginalComponent
 * @param {stirng|object|array} stylesheet
 */
export function scrawl(OriginalComponent, stylesheet) {
  return function(C) {
    return class extends Component {
      onRender() {
        const { defaultStylesheet } = OriginalComponent
        const hasuse = defaultStylesheet || []
        const willuse = [].concat(hasuse).concat(stylesheet)
        OriginalComponent.defaultStylesheet = willuse
        this['_originalDefaultStylesheetOf' + OriginalComponent.name] = defaultStylesheet
      }
      onRendered() {
        const defaultStylesheet = this['_originalDefaultStylesheetOf' + OriginalComponent.name]
        OriginalComponent.defaultStylesheet = defaultStylesheet
        delete this['_originalDefaultStylesheetOf' + OriginalComponent.name]
      }
      render() {
        const { children, ...rest } = this.props
        return <C {...rest}>{children}</C>
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
