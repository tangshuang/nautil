import { Component } from '../core/component.js'
import { noop } from '../core/utils.js'

export class Text extends Component {
  static defaultProps = {
    onHint: noop,
    onHintEnter: noop,
    onHintStart: noop,
    onHintMove: noop,
    onHintEnd: noop,
    onHintLeave: noop,
  }
}
export default Text
