import { Component } from '../core/component.js'
import { noop } from '../core/utils.js'

export class Section extends Component {
  static props = {
    onHint: Function,
    onHintStart: Function,
    onHintMove: Function,
    onHintEnd: Function,
    onHintCancel: Function,
  }
  static defaultProps = {
    onHint: noop,
    onHintStart: noop,
    onHintMove: noop,
    onHintEnd: noop,
    onHintCancel: noop,
  }
}
export default Section
