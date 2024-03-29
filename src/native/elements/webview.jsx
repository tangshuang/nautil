import { WebView as NativeWebview } from 'react-native'
import Webview from '../../lib/elements/webview.jsx'

Webview.implement(class {
  render() {
    const { source, width, height, ...rest } = this.attrs
    const style = { ...this.style, width, height }
    return <NativeWebview source={source} {...rest} style={style}>{this.children}</NativeWebview>
  }
})

export { Webview }
export default Webview
