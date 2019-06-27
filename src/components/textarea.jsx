import Component from '../core/component'
import { ifexist } from '../core/types'
import { noop } from '../core/utils'

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
