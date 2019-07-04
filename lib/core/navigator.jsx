import Component from './component.js'
import Navigation from './navigation.js'
import Observer from './observer.jsx'
import { Provider, Consumer } from './provider.jsx'
import React from 'react'

export class Navigator extends Component {
  static validateProps = {
    navigation: Navigation,
  }

  render() {
    const { navigation } = this.attrs
    return (
      <Observer subscribe={dispatch => navigation.on('*', dispatch)} dispatch={() => this.forceUpdate()}>
        <Provider name="$navigation" value={navigation}>
          {this.children}
        </Provider>
      </Observer>
    )
  }
}

export default Navigator

export class Navigate extends Component {
  static validateProps = {
    to: String,
    params: Object,
    replace: Boolean,
    open: String,
  }
  static defaultProps = {
    open: false,
    params: {},
    replace: false,
  }

  render() {
    return (
      <Consumer name="$navigation">
        {(navigation) => {
          const go = () => {
            if (open) {
              navigation.open(open, params)
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
