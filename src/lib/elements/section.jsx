import { Component } from '../component.js'
import { noop } from '../utils.js'

export class Section extends Component {
  static props = {
    onHit: Function,
    onHitStart: Function,
    onHitMove: Function,
    onHitEnd: Function,
    onHitCancel: Function,
    onHitOutside: Function,
  }
  static defaultProps = {
    onHit: noop,
    onHitStart: noop,
    onHitMove: noop,
    onHitEnd: noop,
    onHitCancel: noop,
    onHitOutside: noop,
  }
}
export default Section