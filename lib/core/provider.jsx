import React from 'react'
import { Any } from './types.js'
import Observer from './observer.jsx'
import { PROVIDER_RECORDS } from './_shared.js'
import Component from './component.js'

export class Provider extends Component {
  static validateProps = {
    name: String,
    value: Any,
  }

  constructor(props) {
    super(props)

    const { name, value } = this.props
    const context = React.createContext(value)
    PROVIDER_RECORDS[name] = {
      context,
      value,
    }
  }
  componentWillUnmount() {
    const { name } = this.props
    delete PROVIDER_RECORDS[name]
  }
  render() {
    const { name, children } = this.props
    const { value, context } = PROVIDER_RECORDS[name]
    const { Provider } = context
    return <Provider value={value}>
      {children}
    </Provider>
  }
}

export default Provider

export class Consumer extends Component {
  static validateProps = {
    name: String,
  }

  constructor(props) {
    super(props)

    const { name } = this.props
    if (!PROVIDER_RECORDS[name]) {
      throw new Error(`Consumer '${name}' has not been registerd.`)
    }
  }

  render() {
    const { name, children } = this.props
    const { context } = PROVIDER_RECORDS[name]
    const { Consumer } = context
    return <Consumer>
      {children}
    </Consumer>
  }
}

export class ObservableProvider extends Component {
  static validateProps = {
    name: String,
    value: Any,
    subscribe: Function,
    dispatch: Function,
  }

  render() {
    const { name, value, subscribe, dispatch } = this.attrs
    return (
      <Observer subscribe={subscribe} dispatch={dispatch}>
        <Provider name={name} value={value}>
          {this.children}
        </Provider>
      </Observer>
    )
  }
}
