import { enumerate } from 'tyshemo'

import Component from '../core/component.js'
import { Unit } from '../core/types.js'
import { noop } from '../core/utils.js'

export class Audio extends Component {
  static props = {
    source: enumerate([String, Object]),
    width: Unit,
    height: Unit,
    onPlay: Function,
    onPause: Function,
    onStop: Function,
    onDrag: Function,
    onResume: Function,
    onReload: Function,
    onLoad: Function,
    onTick: Function,
    onVolume: Function,
  }
  static defaultProps = {
    width: '100%',
    height: 90,
    onPlay: noop,
    onPause: noop,
    onStop: noop,
    onDrag: noop,
    onResume: noop,
    onReload: noop,
    onLoad: noop,
    onTick: noop,
    onVolume: noop,
  }
}
export default Audio
