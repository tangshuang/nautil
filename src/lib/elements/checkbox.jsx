import Component from '../core/component.js'
import { noop } from '../core/utils.js'

export class Checkbox extends Component {
  static props = {
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
