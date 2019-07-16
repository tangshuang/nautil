import React from 'react'
import Observer from './observer.jsx'
import Component from '../core/component.js'
import { each, isFunction } from '../core/utils.js'

export class Provider extends Component {
  static props = {
    context: Object,
  }
  render() {
    const { context, children } = this.props
    const { Provider, value } = context
    return <Provider value={value}>
      {children}
    </Provider>
  }
}

export default Provider

export class Consumer extends Component {
  static props = {
    context: Object,
  }

  render() {
    const { context, children } = this.props
    const { Consumer } = context
    return <Consumer>
      {children}
    </Consumer>
  }
}

export class ObservableProvider extends Component {
  static props = {
    context: Object,
    subscribe: Function,
    dispatch: Function,
  }

  render() {
    const { context, subscribe, dispatch, children } = this.props
    const { Provider, value } = context
    return (
      <Observer subscribe={subscribe} dispatch={dispatch}>
        <Provider value={value}>
          {children}
        </Provider>
      </Observer>
    )
  }
}

export function connect(given = {}, merge) {
  const pipe = []
  each(given, (context, prop) => {
    const generate = (children) => <Consumer context={context}>{children}</Consumer>
    pipe.push({
      prop,
      generate,
    })
  })

  const consume = (fn, props) => pipe.reduce((fn, { prop, generate }) => () => generate((value) => {
    props[prop] = value
    return fn()
  }), fn)

  return function(Component) {
    return function(props = {}) {
      const provideProps = {}
      const fn = () => {
        const attrs = { ...props, ...provideProps }
        const merged = isFunction(merge) ? merge(attrs) || {} : {}
        const final = { ...attrs, ...merged }
        return <Component {...final}></Component>
      }
      return consume(fn, provideProps)()
    }
  }
}
