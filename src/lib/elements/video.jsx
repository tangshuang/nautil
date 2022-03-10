import { enumerate, dict } from 'tyshemo'

import Component from '../core/component.js'
import { Unit } from '../types.js'

export class Video extends Component {
  static props = {
    source: enumerate([String, dict({
      url: String,
    })]),
    width: Unit,
    height: Unit,

    onPlay: false,
    onPause: false,
    onStop: false,
    onDrag: false,
    onResume: false,
    onReload: false,
    onLoad: false,
    onTick: false,
    onVolume: false,
  }
  static defaultProps = {
    width: '100%',
    height: 90,
  }
}
export default Video
