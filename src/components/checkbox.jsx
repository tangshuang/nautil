import Component from '../core/component'
import { Any, ifexist } from '../core/types'
import { noop } from '../core/utils'

export class Checkbox extends Component {
  static injectProps = {
    $state: true,
  }
  static checkProps = {
    value: ifexist(Any),

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
