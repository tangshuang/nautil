import Component from '../core/component'
import { enumerate } from '../core/types'

export class Video extends Component {
  static PropTypes = {
    source: enumerate(String, Object),
    width: Number,
    height: Number,

    onLoad: Function,
    onReload: Function,
    onResize: Function,
    onScroll: Function,
    onMessage: Function,
  }
  static defaultProps = {
    width: Infinity,
    height: Infinity,
  }
}
export default Video
