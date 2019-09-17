import Component from '../core/component.js'
import { enumerate, Handler } from '../core/types.js'
import { noop } from '../core/utils.js'

export class Audio extends Component {
  static props = {
    source: enumerate([ String, Object ]),
    width: Number,
    height: Number,

    onPlay: Handler,
    onPause: Handler,
    onStop: Handler,
    onDrag: Handler,
    onResume: Handler,
    onReset: Handler,
    onReload: Handler,
    onLoad: Handler,
    onTick: Handler,
    onVolume: Handler,
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
    onVolume: noop,
  }
}
export default Audio
