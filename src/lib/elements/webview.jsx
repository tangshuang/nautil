import { enumerate, dict } from 'tyshemo'

import Component from '../core/component.js'
import { Unit } from '../core/types.js'
import { noop } from '../core/utils.js'

export class Webview extends Component {
  static props = {
    source: enumerate([String, dict({
      url: String,
    })]),
    width: Unit,
    height: Unit,

    onLoad: Function,
    onReload: Function,
    onResize: Function,
    onScroll: Function,
    onMessage: noop,
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
