import { Component } from '../core/component'
import { enumerate, list } from '../core/types'
import { Style } from '../core/stylesheet'

export class Section extends Component {
  static PropTypes = {
    stylesheet: enumerate(Style, list(Style)),
    flex: Number,
    onHintEnter: Function,
    onHintStart: Function,
    onHintMove: Function,
    onHintEnd: Function,
    onHintLeave: Function,
  }
}
export default Section
