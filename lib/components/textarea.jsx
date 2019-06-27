import Component from '../core/component.js'
import { ifexist } from '../core/types.js'
import { noop } from '../core/utils.js'

export class Textarea extends Component {
  static injectProps = {
    $state: true,
  }
  static checkProps = {
    value: ifexist(String),
    model: ifexist(String),

    line: Number,
    placeholder: ifexist(String),

    onChange: Function,
    onFocus: Function,
    onBlur: Function,
    onSelect: Function,
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
