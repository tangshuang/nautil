import Component from '../core/component.js'
import { Any, ifexist, Handling } from '../core/types.js'
import { noop } from '../core/utils.js'

export class Checkbox extends Component {
  static props = {
    checkedValue: ifexist(Any),
    uncheckedValue: ifexist(Any),
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
export default Checkbox
