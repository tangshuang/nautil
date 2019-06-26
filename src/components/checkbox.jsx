import Component from '../core/component'
import { Any } from '../core/types'

export class Checkbox extends Component {
  static PropTypes = {
    value: Any,
    checked: Boolean,

    onCheck: Function,
    onUncheck: Function,
  }
}
export default Checkbox