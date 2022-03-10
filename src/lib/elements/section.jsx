import { Component } from '../core/component.js'

export class Section extends Component {
  static props = {
    onHit: false,
    onHitStart: false,
    onHitMove: false,
    onHitEnd: false,
    onHitCancel: false,
    onHitOutside: false,
  }
}
export default Section
