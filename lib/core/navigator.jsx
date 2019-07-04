import Component from './component.js'
import Navigation from './navigation.js'
import Observer from './observer.jsx'
import { Provider, Consumer } from './provider.jsx'
import React from 'react'
import { ifexist, enumerate } from './types.js'
import { isNumber } from './utils.js'

export class Navigator extends Component {
  static validateProps = {
    navigation: Navigation,
    dispatch: Function,
  }

  render() {
    const { navigation, dispatch } = this.attrs
    return (
      <Observer subscribe={dispatch => navigation.on('*', dispatch)} dispatch={dispatch}>
        <Provider name={'$navigation'} value={navigation}>
          {this.children}
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
      <Consumer name="$navigation">
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
              return <Text onHintEnd={() => go()}>{child}</Text>
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
