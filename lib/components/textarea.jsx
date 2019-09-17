import Component from '../core/component.js'
import { ifexist, Handling } from '../core/types.js'
import { noop } from '../core/utils.js'

export class Textarea extends Component {
  static props = {
    value: ifexist(String),
    // model: ifexist(String),

    line: Number,
    placeholder: ifexist(String),

    onChange: Handling,
    onFocus: Handling,
    onBlur: Handling,
    onSelect: Handling,
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
