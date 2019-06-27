import Component from '../core/component.js'
import { Any, list, ifexist } from '../core/types.js'
import { noop } from '../core/utils.js'

export class Select extends Component {
  static injectProps = {
    $state: true,
  }
  static checkProps = {
    value: ifexist(Any),
    model: ifexist(String),

    options: list({
      text: String,
      value: Any,
      disabled: ifexist(Boolean),
    }),
    placeholder: ifexist(String),

    onCheck: Function,
    onUncheck: Function,
  }
  static defaultProps = {
    onCheck: noop,
    onUncheck: noop,
  }
}
export default Select
