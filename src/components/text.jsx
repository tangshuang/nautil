import { Component } from '../core/component.js'

export class Text extends Component {
  static propTypes = {
    onHintEnter: Function,
    onHintStart: Function,
    onHintMove: Function,
    onHintEnd: Function,
    onHintLeave: Function,
  }
}
export default Text
