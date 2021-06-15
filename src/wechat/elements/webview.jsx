import { mixin } from 'ts-fns'
import Webview from '../../lib/elements/webview.jsx'
import { Style } from '../../lib/style/style.js'

mixin(Webview, class {
  render() {
    const { source, width, height, ...rest } = this.attrs
    const style = { width, height, ...this.style }
    const src = isString(source) ? source : source.uri
    return <web-view {...rest} src={src} style={Style.stringify(style)} class={this.className}></web-view>
  }
})

export { Webview }
export default Webview
