import Component from '../core/component'
import { Any } from '../core/types'

export class Checkbox extends Component {
  static AcceptableProps = {
    $state: true,
  }
  static PropTypes = {
    checkedValue: Any,
    uncheckedValue: Any,

    checked: Boolean,

    model: String,

    onCheck: Function,
    onUncheck: Function,
  }
}
export default Checkbox
