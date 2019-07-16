import Component from '../core/component.js'
import { enumerate, ifexist } from '../core/types.js'
import { noop } from '../core/utils.js'

export class Input extends Component {
  static injectProps = {
    $state: true,
  }
  static props = {
    type: enumerate([ 'text', 'number', 'email', 'tel', 'url' ]),
    placeholder: ifexist(String),

    value: ifexist(enumerate([ String, Number ])),
    // how to use model?
    // 1. you should accept a `$state` prop
    // 2. when you typing in the input, $state[modelKeyPath] will be updated automaticly
    model: ifexist(String),

    onChange: Function,
    onFocus: Function,
    onBlur: Function,
    onSelect: Function,
  }
  static defaultProps = {
    type: 'text',
    onChange: noop,
    onFocus: noop,
    onBlur: noop,
    onSelect: noop,
  }
}
export default Input
