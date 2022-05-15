import {
  isFunction,
  isString,
  isArray,
} from 'ts-fns'

import Component from '../core/component.js'
import Observer from '../components/observer.jsx'

export function observe(subscription, unsubscription) {
  return (C) => class extends Component {
    onInit() {
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

      // subscribe to store or data service
      if (subscription && typeof subscription === 'object' && subscription.subscribe && subscription.unsubscribe) {
        subscribe = (update) => subscription.subscribe(update)
        unsubscribe = (update) => subscription.unsubscribe(update)
      }
      // subscribe to model
      else if (subscription && typeof subscription === 'object' && subscription.watch && subscription.unwatch) {
        subscribe = (update) => {
          subscription.watch('*', update, true)
          subscription.watch('!', update, true)
          subscription.on('recover', update)
        }
        unsubscribe = (update) => {
          subscription.unwatch('*', update)
          subscription.unwatch('!', update)
          subscription.on('recover', update)
        }
      }

      this._observerSubscribe = subscribe
      this._observerUnsubscribe = unsubscribe
    }
    render() {
      return (
        <Observer subscribe={this._observerSubscribe} unsubscribe={this._observerUnsubscribe} render={() => <C {...this.props} />} />
      )
    }
  }
}

export function evolve(shouldUpdate) {
  return (C) => class extends Component {
    shouldUpdate(nextProps) {
      return shouldUpdate(nextProps)
    }
    render() {
      return <C {...this.props} />
    }
  }
}

/**
 * Add a new prop for some component
 * @param {*} prop
 * @param {function|any} define
 */
export function inject(prop, define) {
  return (C) => class extends Component {
    render() {
      const { children, ...props } = this.props
      props[prop] = isFunction(define) ? define(this.props) : define
      return <C {...props}>{children}</C>
    }
  }
}

/**
 * Initialize a Constructor when the component initialize
 * @param {*} prop
 * @param {*} Constructor
 * @param {...any} args the parameters which passed into the class constructor when initialize
 */
export function initialize(prop, Constructor, ...args) {
  return (C) => class extends Component {
    init() {
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

/**
 * wrap a component by a HOC
 * @param {ReactComponent} HOC
 * @param {Array<string|null>} params
 * @param {string} renderProp
 * @returns
 * @example
 * decorate(Consumer, ['state', 'dispatch'])(MyComponent)
 * -> props => <Consumer>(state, dispatch) => <MyComponent {...props} state={state} dispatch={dispatch} /></Consumer>
 */
export function decorate(HOC, params, renderProp) {
  return (C) => class extends Component {
    render() {
      const givenProps = this.props
      const fn = (...args) => {
        const localProps = {}
        if (params && isArray(params)) {
          params.forEach((field, i) => {
            if (i >= args.length) {
              return
            }
            if (!field) {
              return
            }
            const arg = args[i]
            localProps[field] = arg
          })
        }

        const finalProps = {
          ...localProps,
          ...givenProps,
        }
        return <C {...finalProps} />
      }

      if (renderProp) {
        const attrs = {
          [renderProp]: fn,
        }
        return <HOC {...attrs} />
      }

      return (
        <HOC>{fn}</HOC>
      )
    }
  }
}

/**
 * create a component which is wrapped be nested components
 * @param  {...any} args list of [Component, props]
 */
export function nest(...args) {
  return (C) => class extends Component {
    render() {
      const { props } = this
      const realContent = <C {...props} />
      let finalContent = realContent

      const items = args.reverse()
      items.forEach((item) => {
        if (!item) {
          return
        }

        const [Component, getProps] = item
        const props = isFunction(getProps) ? getProps(this.props) : getProps
        finalContent = <Component {...props}>{finalContent}</Component>
      })

      return finalContent
    }
  }
}
