import { enumerate, ifexist, dict } from 'tyshemo'

import Component from '../component.js'
import { Unit } from '../types.js'
import { noop } from '../utils.js'

export class Image extends Component {
  static props = {
    source: enumerate([String, dict({
      uri: String,
    })]),
    width: Unit,
    height: Unit,
    maxWidth: ifexist(Unit),
    maxHeight: ifexist(Unit),
    onLoad: Function,
  }
  static defaultProps = {
    width: '100%',
    height: 'auto',
    onLoad: noop,
  }
}
export default Image

// TODO: use image as background