import React from 'react'
import Fragment from './fragment.jsx'

export class Observer extends React.Component {
  static validateProps = {
    subscribe: Function,
  }

  constructor(props) {
    super(props)

    this.state = { ...props }

    const dispatch = () => {
      this.forceUpdate()
    }
    const { subscribe } = props

    subscribe(dispatch)
  }
  render() {
    return <Fragment>
      {React.Children.map(this.props.children, child => React.cloneElement(child))}
    </Fragment>
  }
}
