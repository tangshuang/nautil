import Component from '../core/component'
import { Any } from '../core/types'

export class Radio extends Component {
  static AcceptableProps = {
    $state: true,
  }
  static PropTypes = {
    value: Any,

    checked: Boolean,

    model: String,

    onCheck: Function,
    onUncheck: Function,
  }
}
export default Radio
