import Component from '../core/component.js'
import Navigation from '../core/navigation.js'
import Observer from './observer.jsx'
import React from 'react'
import { enumerate } from '../core/types.js'
import { isNumber, createContext, cloneChildren, cloneElement } from '../core/utils.js'

const context = createContext()

export class Navigator extends Component {
  static props = {
    navigation: Navigation,
  }

  render() {
    const { navigation } = this.attrs
    const { Provider } = context

    const Page = () => {
      const { options, status, state } = navigation
      const isInside = options.routes.find(item => item.component)
      const { notFound } = options

      if (isInside) {
        return status === '!' ? notFound ? <notFound /> : null
          : status !== '' ? state.route.component ? <state.route.component /> : null
          : cloneChildren(this.children)
      }
      else {
        return cloneChildren(this.children)
      }
    }

    return (
      <Observer subscribe={dispatch => navigation.on('*', dispatch)} unsubscribe={dispatch => navigation.off('*', dispatch)} dispatch={this.update}>
        <Provider value={navigation}>
          {Page()}
        </Provider>
      </Observer>
    )
  }
}

export default Navigator

export class Navigate extends Component {
  static props = {
    to: enumerate([String, Number]),
    params: Object,
    replace: Boolean,
    open: Boolean,
  }
  static defaultProps = {
    params: {},
    replace: false,
    open: false,
  }

  render() {
    const { to, params, replace, open } = this.attrs
    const { Consumer } = context

    return (
      <Consumer>
        {(navigation) => {
          const go = () => {
            if (isNumber(to) && to < 0) {
              navigation.back(to)
            }
            else if (open) {
              navigation.open(to, params)
            }
            else {
              navigation.go(to, params, replace)
            }
          }
          return React.Children.map(this.children, (child) => {
            if (!child.type) {
              return <Text onHint={() => go()}>{child}</Text>
            }
            else {
              return cloneElement(child, { onHintEnd: () => go() })
            }
          })
        }}
      </Consumer>
    )
  }
}

Navigate.Context = context
