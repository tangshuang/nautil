import React from 'react'
import { mixin } from 'ts-fns'
import Webview from '../../lib/elements/webview.jsx'

mixin(Webview, class {
  render() {
    const { source, width, height, ...rest } = this.attrs
    const style = { width, height, ...this.style }
    const src = isString(source) ? source : source.uri
    return <iframe {...rest} src={src} style={style} className={this.className}></iframe>
  }
})

export { Webview }
export default Webview
