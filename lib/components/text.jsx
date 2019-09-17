import { Component } from '../core/component.js'
import { noop } from '../core/utils.js'
import { Handler } from '../core/types.js'

export class Text extends Component {
  static props = {
    onHint: Handler,
    onHintEnter: Handler,
    onHintStart: Handler,
    onHintMove: Handler,
    onHintEnd: Handler,
    onHintLeave: Handler,
  }
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
