import Component from '../core/component'
import { enumerate, ifexist } from '../core/types'
import { noop } from '../core/utils'

export class Textarea extends Component {
  static injectProps = {
    $state: true,
  }
  static checkProps = {
    value: enumerate(String, Number),
    model: ifexist(String),

    line: Number,
    placeholder: ifexist(String),

    onInput: Function,
    onChange: Function,
    onFocus: Function,
    onBlur: Function,
    onRangeSelect: Function,
  }
  static defualtProps = {
    line: 3,
    onInput: noop,
    onChange: noop,
    onFocus: noop,
    onBlur: noop,
    onRangeSelect: noop,
  }
}
export default Textarea
