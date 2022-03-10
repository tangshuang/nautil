import { enumerate, dict } from 'tyshemo'

import Component from '../core/component.js'
import { Unit } from '../types.js'

export class Webview extends Component {
  static props = {
    source: enumerate([String, dict({
      url: String,
    })]),
    width: Unit,
    height: Unit,

    onLoad: false,
    onReload: false,
    onResize: false,
    onScroll: false,
    onMessage: false,
  }
  static defaultProps = {
    width: '100%',
    height: '100%',
  }
}
export default Webview
