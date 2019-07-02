import Component from '../core/component.js'
import Navigation from '../core/navigation.js'
import React from 'react'
import Fragment from './fragment.jsx'

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
          return React.cloneElement(child, { onHintEnd: () => this.go() })
        })}
      </Fragment>
    )
  }
}
export default Navigate
