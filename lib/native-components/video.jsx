import Component from '../core/component.js'
import { enumerate } from '../core/types.js'
import { noop } from '../core/utils.js'

export class Video extends Component {
  static props = {
    source: enumerate([ String, Object ]),
    width: Number,
    height: Number,
  }
  static defaultProps = {
    width: Infinity,
    height: Infinity,

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
export default Video
