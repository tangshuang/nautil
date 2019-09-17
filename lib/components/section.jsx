import { Component } from '../core/component.js'
import { noop } from '../core/utils.js'
import { Handling } from '../core/types.js'

export class Section extends Component {
  static props = {
    onHint: Handling,
    onHintEnter: Handling,
    onHintStart: Handling,
    onHintMove: Handling,
    onHintEnd: Handling,
    onHintLeave: Handling,
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
export default Section
