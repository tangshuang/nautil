import Component from '../core/component'
import { enumerate, ifexist } from '../core/types'

export class Input extends Component {
  static AcceptableProps = {
    $state: true,
  }
  static PropTypes = {
    type: enumerate('text', 'number', 'email', 'tel', 'url'),
    value: enumerate(String, Number),

    // how to use model?
    // 1. you should accept a `$state` prop
    // 2. when you typing in the input, $state[modelKeyPath] will be updated automaticly
    model: ifexist(String),

    onInput: Function,
    onChange: Function,
    onFocus: Function,
    onBlur: Function,
  }
  static defaultProps = {
    type: 'text',
  }
}
export default Input
