import { mixin } from 'ts-fns'

import { _Link, Link } from '../../lib/navigation/link.jsx'

mixin(_Link, class {
  getHref() {
    const { to, params, navigation } = this.attrs
    const state = navigation.makeState(to, params)
    const href = navigation.$makeHref(state)
    return href
  }

  render() {
    const { open } = this.attrs
    const href = this.getHref()
    return <a
      href={href}
      target={open ? '_blank' : '_self'}
      className={this.className}
      style={this.style}
      onClick={e => !open && (e.preventDefault(),this.goto())}
    >{this.children}</a>
  }
})

export { Link }
export default Link
