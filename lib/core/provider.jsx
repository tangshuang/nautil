import React from 'react'
import { Any } from './types.js'

const providers = {}

export class Provider extends React.Component {
  static validateProps = {
    name: String,
    value: Any,
  }

  constructor(props) {
    super(props)

    const { name, value } = this.props
    const context = React.createContext(value)
    providers[name] = {
      context,
      value,
    }
  }
  componentWillUnmount() {
    const { name } = this.props
    delete providers[name]
  }
  render() {
    const { name, children } = this.props
    const { value, context } = providers[name]
    const { Provider } = context
    return <Provider value={value}>
      {children}
    </Provider>
  }
}

export default Provider

export class Consumer extends React.Component {
  static validateProps = {
    name: String,
  }

  constructor(props) {
    super(props)

    const { name } = this.props
    if (!providers[name]) {
      throw new Error(`Consumer '${name}' has not been registerd.`)
    }
  }

  render() {
    const { name, children } = this.props
    const { context } = providers[name]
    const { Consumer } = context
    return <Consumer>
      {children}
    </Consumer>
  }
}
