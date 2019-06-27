import { Component } from '../core/component.js'
import { noop } from '../core/utils.js'

export class Text extends Component {
  static checkProps = {
    onHintEnter: Function,
    onHintStart: Function,
    onHintMove: Function,
    onHintEnd: Function,
    onHintLeave: Function,
  }
  static defaultProps = {
    onHintEnter: noop,
    onHintStart: noop,
    onHintMove: noop,
    onHintEnd: noop,
    onHintLeave: noop,
  }
}
export default Text
