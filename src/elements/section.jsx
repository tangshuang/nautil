import { Component } from '../core/component.js'
import { noop } from '../utils.js'

export class Section extends Component {
  static defaultProps = {
    onHint: noop,
    onHintStart: noop,
    onHintMove: noop,
    onHintEnd: noop,
    onHintCancel: noop,
  }
}
export default Section
