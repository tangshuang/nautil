import Component from '../core/component.js'
import { enumerate, ifexist, Unit } from '../core/types.js'
import { noop } from '../core/utils.js'

export class Image extends Component {
  static props = {
    source: enumerate([String, Object]),
    width: Unit,
    height: Unit,
    maxWidth: ifexist(Unit),
    maxHeight: ifexist(Unit),
  }
  static defaultProps = {
    width: '100%',
    height: 'auto',

    onLoad: noop,
  }
}
export default Image

// TODO: use image as background
