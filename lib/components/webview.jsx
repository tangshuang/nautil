import Component from '../core/component.js'
import { enumerate, Unit } from '../core/types.js'
import { noop } from '../core/utils.js'

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
}
export default Webview
