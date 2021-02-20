import { Component } from '../component.js'

export class Button extends Component {
  static props = {
    onHit: false,
    onHitStart: false,
    onHitEnd: false,
  }
  static defaultProps = {
    type: 'button',
  }
}
export default Button
