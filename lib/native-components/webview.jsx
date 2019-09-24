import Component from '../core/component.js'
import { WebView as NativeWebview } from 'react-native'

export class Webview extends Component {
  render() {
    const { source, width, height, ...rest } = this.attrs
    const style = { ...this.style, width, height }
    return <NativeWebview source={source} {...rest} style={style}>{this.children}</NativeWebview>
  }
}
export default Webview
