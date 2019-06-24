import { Component } from '../core/component.js'
import { enumerate, list } from '../core/types.js'
import { Style } from '../core/stylesheet.js'

export class Text extends Component {
  static propTypes = {
    stylesheet: enumerate(Style, list(Style)),
    onHintEnter: Function,
    onHintStart: Function,
    onHintMove: Function,
    onHintEnd: Function,
    onHintLeave: Function,
  }
}
export default Text
