import Component from '../core/component'
import { enumerate } from '../core/types'

export class Image extends Component {
  static PropTypes = {
    source: enumerate(String, Object),
    width: Number,
    height: Number,
  }
}
export default Image

// TODO: use image as background