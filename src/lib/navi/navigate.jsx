import { enumerate } from 'tyshemo'

import Navigation from './navigation.js'
import Link from './link.jsx'
import Component from '../core/component.js'

export class _Navigate extends Link {
  static props = {
    navigation: Navigation,
    to: enumerate([String, Number]),
    params: Object,
    replace: Boolean,
    open: Boolean,
    render: Function,
  }
  static defaultProps = {
    params: {},
    replace: false,
    open: false,
  }

  render() {
    const { open, render } = this.attrs
    const goto = this.goto.bind(this)
    const href = this.getHref()
    return render(goto, href, open)
  }
}

export class Navigate extends Component {
  render() {
    return <_Navigate {...this.props} />
  }
}

export default Navigate
