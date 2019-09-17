import Component from '../core/component.js'
import { Any, ifexist, Handler } from '../core/types.js'
import { noop } from '../core/utils.js'

export class Radio extends Component {
  static props = {
    value: ifexist(Any),
    // model: ifexist(String),

    checked: Boolean,

    onCheck: Handler,
    onUncheck: Handler,
  }
  static defaultProps = {
    checked: false,
    onCheck: noop,
    onUncheck: noop,
  }
}
export default Radio
