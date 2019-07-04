import React from 'react'

export class Observer extends React.Component {
  static validateProps = {
    subscribe: Function,
    dispatch: Function,
  }

  constructor(props) {
    super(props)

    const { subscribe, dispatch } = this.props
    subscribe(dispatch)
  }
  render() {
    return this.props.children
  }
}
export default Observer
