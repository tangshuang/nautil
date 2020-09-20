import { enumerate, ifexist } from 'tyshemo'

import Component from '../core/component.js'
import { noop } from '../core/utils.js'

export class Input extends Component {
  static props = {
    type: enumerate(['text', 'number', 'email', 'tel', 'url']),
    placeholder: ifexist(String),
    value: enumerate([String, Number]),
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
