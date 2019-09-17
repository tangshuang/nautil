import Component from '../core/component.js'
import { enumerate, Handling } from '../core/types.js'
import { noop } from '../core/utils.js'

export class Video extends Component {
  static props = {
    source: enumerate([ String, Object ]),
    width: Number,
    height: Number,

    onPlay: Handling,
    onPause: Handling,
    onStop: Handling,
    onDrag: Handling,
    onResume: Handling,
    onReset: Handling,
    onReload: Handling,
    onLoad: Handling,
    onTick: Handling,
    onVolume: Handling,
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
