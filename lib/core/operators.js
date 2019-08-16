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
    return class extends Component {
      render() {
        const { Consumer } = context
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
        props[prop] = define(this.props)
        return <C {...props}>{children}</C>
      }
    }
  }
}

export function pollute(Pure, pollute) {
  return function(C) {
    return class extends Component {
      onRender() {
        const { defaultProps } = Pure
        const hasuse = defaultProps || {}
        const pollutedProps = pollute(this.props)
        const willuse = { ...hasuse, ...pollutedProps }
        Pure.defaultProps = willuse
        this._originalDefaultProps = defaultProps
      }
      onRendered() {
        const defaultProps = this._originalDefaultProps
        Pure.defaultProps = defaultProps
      }
      render() {
        const { children, ...props } = this.props
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