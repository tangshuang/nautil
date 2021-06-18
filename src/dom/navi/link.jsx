import { mixin } from 'ts-fns'

import { _Link as Link } from '../../lib/navi/link.jsx'

mixin(Link, class {
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
