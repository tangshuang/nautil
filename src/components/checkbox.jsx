import Component from '../core/component'
import { Any, ifexist } from '../core/types'
import { noop } from '../core/utils'

export class Checkbox extends Component {
  static injectProps = {
    $state: true,
  }
  static checkProps = {
    checkedValue: ifexist(Any),
    uncheckedValue: ifexist(Any),
    value: ifexist(Any),
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
