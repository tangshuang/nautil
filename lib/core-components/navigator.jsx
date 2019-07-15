import Component from '../core/component.js'
import Navigation from '../core/navigation.js'
import Observer from './observer.jsx'
import { Provider, Consumer } from './provider.jsx'
import React from 'react'
import { enumerate } from '../core/types.js'
import { isNumber, createContext } from '../core/utils.js'

const context = createContext()

export class Navigator extends Component {
  static validateProps = {
    navigation: Navigation,
  }

  render() {
    const { navigation } = this.attrs

    const Page = () => {
      const { options, status, state } = navigation
      const isInside = options.routes.find(item => item.component)
      const { notFound } = options
      const children = React.Children.map(this.children, (child) => React.cloneElement(child))

      if (isInside) {
        return status === '!' ? notFound ? <notFound /> : null
          : status !== '' ? state.route.component ? <state.route.component /> : null
          : children
      }
      else {
        return children
      }
    }

    return (
      <Observer subscribe={dispatch => navigation.on('*', dispatch)} dispatch={this.update}>
        <Provider context={context} value={navigation}>
          {Page()}
        </Provider>
      </Observer>
    )
  }
}

export default Navigator

export class Navigate extends Component {
  static validateProps = {
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
    return (
      <Consumer context={context}>
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
              return React.cloneElement(child, { onHintEnd: () => go() })
            }
          })
        }}
      </Consumer>
    )
  }
}

Navigate.Context = context
