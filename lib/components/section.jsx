import { Component } from '../core/component.js'
import { noop } from '../core/utils.js'

export class Section extends Component {
  static defaultProps = {
    onHint: noop,
    onHintStart: noop,
    onHintMove: noop,
    onHintEnd: noop,
  }
}
export default Section
