import Component from '../core/component.js'
import { enumerate, Unit } from '../core/types.js'
import { noop } from '../utils.js'

export class Video extends Component {
  static props = {
    source: enumerate([String, Object]),
    width: Unit,
    height: Unit,
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
  render() {
    // TODO
    return null
  }
}
export default Video
