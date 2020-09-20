import { enumerate } from 'tyshemo'

import Component from '../core/component.js'
import { noop } from '../core/utils.js'

export class SwipeSection extends Component {
  static props = {
    sensitivity: Number,
    distance: Number,
    disabled: Boolean,
    direction: enumerate(['left', 'right', 'both']),
    throttle: Number,

    onStart: Function,
    onMove: Function,
    onEnd: Function,
    onCancel: Function,
    onReach: Function,
    onUnreach: Function,
  }

  static defaultProps = {
    sensitivity: 5,
    distance: 100,
    disabled: false,
    direction: 'both',
    throttle: 0,
    onStart: noop,
    onMove: noop,
    onEnd: noop,
    onCancel: noop,
    onReach: noop,
    onUnreach: noop,
  }
}
export default SwipeSection
