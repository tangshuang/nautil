import Component from '../core/component'
import { enumerate } from '../core/types'

export class Image extends Component {
  static checkProps = {
    source: enumerate(String, Object),
    width: Number,
    height: Number,
  }
  static defaultProps = {
    width: Infinity,
    height: Infinity,
  }
}
export default Image

// TODO: use image as background
