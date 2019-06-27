import Component from '../core/component'
import { enumerate } from '../core/types'
import { noop } from '../core/utils'

export class Audio extends Component {
  static checkProps = {
    source: enumerate(String, Object),
    width: Number,
    height: Number,

    onPlay: Function,
    onPause: Function,
    onStop: Function,
    onDrag: Function,
    onResume: Function,
    onReset: Function,
    onReload: Function,
    onLoad: Function,
    onTick: Function,
    onVolumeChange: Function,
  }
  static defaultProps = {
    width: Infinity,
    height: 30,

    onPlay: noop,
    onPause: noop,
    onStop: noop,
    onDrag: noop,
    onResume: noop,
    onReload: noop,
    onLoad: noop,
    onTick: noop,
    onVolumeChange: noop,
  }
}
export default Audio
