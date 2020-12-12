import Component from '../component.js'
import { noop } from '../utils.js'

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
