import { enumerate } from 'tyshemo'

import Component from '../component.js'

export class SwipeSection extends Component {
  static props = {
    sensitivity: Number,
    distance: Number,
    disabled: Boolean,
    direction: enumerate(['left', 'right', 'both']),
    throttle: Number,

    onStart: false,
    onMove: false,
    onEnd: false,
    onCancel: false,
    onReach: false,
    onUnreach: false,
  }

  static defaultProps = {
    sensitivity: 5,
    distance: 100,
    disabled: false,
    direction: 'both',
    throttle: 0,
  }
}
export default SwipeSection
