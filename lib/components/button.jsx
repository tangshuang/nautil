import { Component } from '../core/component.js'
import { noop } from '../core/utils.js'

export class Button extends Component {
  static validateProps = {
    onHint: Function,
    onHintEnter: Function,
    onHintStart: Function,
    onHintMove: Function,
    onHintEnd: Function,
    onHintLeave: Function,
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
export default Button
