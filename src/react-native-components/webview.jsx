import Component from '../core/component.js'
import { WebView as NativeWebview } from 'react-native'
import { enumerate, Unit } from '../types.js'
import { noop } from '../utils.js'

export class Webview extends Component {
  static props = {
    source: enumerate([String, Object]),
    width: Unit,
    height: Unit,
  }
  static defaultProps = {
    width: '100%',
    height: '100%',

    onLoad: noop,
    onReload: noop,
    onResize: noop,
    onScroll: noop,
    onMessage: noop,
  }
  render() {
    const { source, width, height, ...rest } = this.attrs
    const style = { ...this.style, width, height }
    return <NativeWebview source={source} {...rest} style={style}>{this.children}</NativeWebview>
  }
}
export default Webview
