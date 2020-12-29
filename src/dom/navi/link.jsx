import React from 'react'
import { mixin } from 'ts-fns'

import { _Link as Link } from '../../lib/navi/link.jsx'

mixin(Link, class {
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