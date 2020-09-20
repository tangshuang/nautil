import { enumerate } from 'tyshemo'

import Navigation from './navigation.js'
import Link from './link.jsx'

export class Navigate extends Link {
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
export default Navigate
