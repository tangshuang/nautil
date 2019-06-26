import Component from '../core/component'
import { enumerate, ifexist } from '../core/types'

export class Textarea extends Component {
  static AcceptableProps = {
    $state: true,
  }
  static PropTypes = {
    value: enumerate(String, Number),
    line: Number,

    // how to use model?
    // 1. you should accept a `$state` prop
    // 2. when you typing in the input, $state[modelKeyPath] will be updated automaticly
    model: ifexist(String),

    onInput: Function,
    onChange: Function,
    onFocus: Function,
    onBlur: Function,
  }
  static defualtProps = {
    line: 3,
  }
}
export default Textarea
