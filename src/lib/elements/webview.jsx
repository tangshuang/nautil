import { enumerate, dict } from 'tyshemo'

import Component from '../component.js'
import { Unit } from '../types.js'
import { noop } from '../utils.js'

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
    onMessage: Function,
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
