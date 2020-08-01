import Component from '../core/component.js'
import { ifexist } from '../types.js'
import { noop } from '../utils.js'

export class Textarea extends Component {
  static props = {
    value: String,
    line: Number,
    placeholder: ifexist(String),
  }
  static defualtProps = {
    line: 3,

    onChange: noop,
    onFocus: noop,
    onBlur: noop,
    onSelect: noop,
  }
}
export default Textarea
