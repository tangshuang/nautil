import { enumerate } from 'tyshemo'

import Component from '../component.js'
import { Unit } from '../types.js'

export class Audio extends Component {
  static props = {
    source: enumerate([String, Object]),
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
export default Audio
