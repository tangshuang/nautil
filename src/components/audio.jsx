import Component from '../core/component'
import { enumerate } from '../core/types'

export class Audio extends Component {
  static PropTypes = {
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
  }
}
export default Audio