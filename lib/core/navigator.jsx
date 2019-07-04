import Component from './component.js'
import Navigation from './navigation.js'
import Observer from './observer.jsx'
import Provider from './provider.jsx'
import React from 'react'
import Fragment from './fragment.jsx'

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
  static injectProps = {
    $navigation: true,
  }
  static validateProps = {
    to: String,
    params: Object,
    replace: Boolean,
    open: Boolean,
    $navigation: Navigation,
  }
  static defaultProps = {
    open: false,
    params: {},
    replace: false,
  }

  go() {
    const { to, params, open, replace } = this.attrs
    if (open) {
      this.$navigation.open(open, params)
    }
    else {
      this.$navigation.go(to, params, replace)
    }
  }

  render() {
    return (
      <Fragment>
        {React.Children.map(this.children, (child) => {
          if (!child.type) {
            return <Text onHintEnd={() => this.go()}>{child}</Text>
          }
          else {
            return React.cloneElement(child, { onHintEnd: () => this.go() })
          }
        })}
      </Fragment>
    )
  }
}
