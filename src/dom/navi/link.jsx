import { mixin } from 'ts-fns'

import { Link } from '../../lib/navi/link.jsx'

mixin(Link, class {
  getHref(provided) {
    const { to, params, navigation } = this.attrs
    const navi = navigation || provided
    const state = navi.makeState(to, params)
    const href = navi.$makeHref(state)
    return href
  }

  $render(navigation) {
    const { open } = this.attrs
    const href = this.getHref(navigation)
    return <a
      href={href}
      target={open ? '_blank' : '_self'}
      className={this.className}
      style={this.style}
      onClick={e => !open && (e.preventDefault(),this.goto(navigation))}
    >{this.children}</a>
  }
})

export { Link }
export default Link
