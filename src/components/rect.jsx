import { Component } from '../core/component.js'
import { enumerate, list } from '../core/types.js'
import { Style } from '../core/stylesheet.js'

export class Rect extends Component {
  static propTypes = {
    stylesheet: enumerate(Style, list(Style)),
    width: Number,
    height: Number,
  }
}
export default Rect
