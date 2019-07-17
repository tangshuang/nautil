import React from 'react'
import Observer from '../core-components/observer.jsx'
import Component from './component.js'

export function observe(subscribe, unsubscribe) {
  return function(C) {
    return class extends Component {
      render() {
        const { children, ...attrs } = this.props
        return (
          <Observer subscribe={subscribe} unsubscribe={unsubscribe} dispatch={this.update}>
            <C {...attrs}>{children}</C>
          </Observer>
        )
      }
    }
  }
}

export function connect(prop, context) {
  return function(C) {
    return function(props) {
      const { Consumer } = context
      const { children, ...attrs } = props
      return (
        <Consumer>
          {value => {
            attrs[prop] = value
            return <C {...attrs}>{children}</C>}
          }
        </Consumer>
      )
    }
  }
}

export function inject(prop, target) {
  return function(C) {
    return function(props) {
      const { children, ...attrs } = props
      attrs[prop] = target
      return <C {...attrs}>{children}</C>
    }
  }
}

export function pipe(wrappers) {
  const items = [...wrappers]
  items.reverse()
  return function(Component) {
    return items.reduce((C, wrap) => wrap(C), Component)
  }
}
