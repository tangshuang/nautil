import Component from '../core/component.js'
import { enumerate } from '../core/types.js'
import { noop } from '../core/utils.js'

export class Webview extends Component {
  static props = {
    source: enumerate([ String, Object ]),
    width: Number,
    height: Number,
  }
  static defaultProps = {
    width: Infinity,
    height: Infinity,

    onLoad: noop,
    onReload: noop,
    onResize: noop,
    onScroll: noop,
    onMessage: noop,
  }
  render() {
    const { children, source, ...props } = this.props
    return <iframe src={source} {...props}>{children}</iframe>
  }
}
export default Webview
