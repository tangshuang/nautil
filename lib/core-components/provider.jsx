import React from 'react'
import { Any } from '../core/types.js'
import Observer from './observer.jsx'
import Component from '../core/component.js'
import { each, isFunction, isObject } from '../core/utils.js'

export class Provider extends Component {
  static validateProps = {
    context: Object,
    value: Any,
  }
  render() {
    const { context, value, children } = this.props
    const { Provider } = context
    return <Provider value={value}>
      {children}
    </Provider>
  }
}

export default Provider

export class Consumer extends Component {
  static validateProps = {
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
  static validateProps = {
    context: Object,
    value: Any,
    subscribe: Function,
    dispatch: Function,
  }

  render() {
    const { context, value, subscribe, dispatch, children } = this.props
    return (
      <Observer subscribe={subscribe} dispatch={dispatch}>
        <Provider context={context} value={value}>
          {children}
        </Provider>
      </Observer>
    )
  }
}

// export function provide(...given) {
//   const pipe = []
//   given.forEach(([context, value]) => {
//     const generate = (children) => <Provider context={context} value={value}>{children}</Provider>
//     pipe.push(generate)
//   })

//   return function(Component) {
//     return function(props) {
//       return pipe.reduce((children, generate) => generate(children), <Component {...props} />)
//     }
//   }
// }

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
