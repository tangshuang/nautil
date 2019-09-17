import Component from '../core/component.js'
import { Any, ifexist, Handling } from '../core/types.js'
import { noop } from '../core/utils.js'

export class Radio extends Component {
  static props = {
    value: ifexist(Any),
    // model: ifexist(String),

    checked: Boolean,

    onCheck: Handling,
    onUncheck: Handling,
  }
  static defaultProps = {
    checked: false,
    onCheck: noop,
    onUncheck: noop,
  }
}
export default Radio
