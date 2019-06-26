import { Component } from '../core/component'

export class Section extends Component {
  static PropTypes = {
    flex: Number,
    onHintEnter: Function,
    onHintStart: Function,
    onHintMove: Function,
    onHintEnd: Function,
    onHintLeave: Function,
  }
}
export default Section
