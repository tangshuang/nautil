import Component from '../core/component.js'
import { enumerate, ifexist } from '../core/types.js'

export class Image extends Component {
  static checkProps = {
    source: enumerate(String, Object),
    width: Number,
    height: Number,
    maxWidth: ifexist(Number),
    maxHeight: ifexist(Number),
  }
  static defaultProps = {
    width: Infinity,
    height: Infinity,
  }
}
export default Image

// TODO: use image as background
