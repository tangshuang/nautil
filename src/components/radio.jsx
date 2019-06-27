import Component from '../core/component'
import { Any } from '../core/types'

export class Radio extends Component {
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
export default Radio
