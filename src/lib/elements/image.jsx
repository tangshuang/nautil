import { enumerate, ifexist, dict } from 'tyshemo'

import Component from '../core/component.js'
import { Unit } from '../types.js'

export class Image extends Component {
  static props = {
    source: enumerate([String, dict({
      uri: String,
    })]),
    width: Unit,
    height: Unit,
    maxWidth: ifexist(Unit),
    maxHeight: ifexist(Unit),
    onLoad: false,
  }
  static defaultProps = {
    width: '100%',
    height: 'auto',
  }
}
export default Image

// TODO: use image as background
