import Component from '../core/component.js'
import { enumerate, ifexist, Handling } from '../core/types.js'
import { noop } from '../core/utils.js'

export class Image extends Component {
  static props = {
    source: enumerate([ String, Object ]),
    width: Number,
    height: Number,
    maxWidth: ifexist(Number),
    maxHeight: ifexist(Number),

    onLoad: Handling,
  }
  static defaultProps = {
    width: Infinity,
    height: Infinity,

    onLoad: noop,
  }
}
export default Image

// TODO: use image as background
