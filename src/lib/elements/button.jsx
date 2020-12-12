import { Component } from '../component.js'
import { noop } from '../utils.js'

export class Button extends Component {
  static props = {
    onHit: Function,
    onHitStart: Function,
    onHitEnd: Function,
  }
  static defaultProps = {
    onHit: noop,
    onHitStart: noop,
    onHitEnd: noop,
  }
}
export default Button
