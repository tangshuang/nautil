import { enumerate, dict } from 'tyshemo'

import Component from '../component.js'
import { Unit } from '../types.js'
import { noop } from '../utils.js'

export class Video extends Component {
  static props = {
    source: enumerate([String, dict({
      url: String,
    })]),
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
export default Video
