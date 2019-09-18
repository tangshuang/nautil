import Component from '../core/component.js'
import { Any, list, ifexist } from '../core/types.js'
import { noop } from '../core/utils.js'

export class Select extends Component {
  static props = {
    value: ifexist(Any),
    // model: ifexist(String),

    options: list([{
      text: String,
      value: Any,
      disabled: ifexist(Boolean),
    }]),
    placeholder: ifexist(String),
  }
  static defaultProps = {
    onChange: noop,
  }
}
export default Select
