import Component from '../core/component.js'
import { Any, ifexist } from '../core/types.js'
import { noop } from '../core/utils.js'

export class Checkbox extends Component {
  static injectProps = {
    $state: true,
  }
  static props = {
    checkedValue: ifexist(Any),
    uncheckedValue: ifexist(Any),
    model: ifexist(String),

    checked: Boolean,

    onCheck: Function,
    onUncheck: Function,
  }
  static defaultProps = {
    checked: false,
    onCheck: noop,
    onUncheck: noop,
  }
}
export default Checkbox
