import Component from '../core/component'
import { Any, list, ifexist } from '../core/types'

export class Select extends Component {
  static AcceptableProps = {
    $state: true,
  }
  static PropTypes = {
    value: Any,
    options: list({
      text: String,
      value: Any,
      disabled: ifexist(Boolean),
    }),

    model: ifexist(String),

    onCheck: Function,
    onUncheck: Function,
  }
}
export default Select
