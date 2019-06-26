import React, { Fragment } from 'react'

function inject(children, props) {
  return React.Children.map(children, (child) => {
    const children = inject(child.props.children, props)
    return React.cloneElement(child, props, children)
  })
}

export class Provider extends React.Component {
  render() {
    const { children, ...props } = this.props
    return <Fragment>
      {inject(children, props)}
    </Fragment>
  }
}
