import { enumerate, ifexist } from 'tyshemo'

import Component from '../component.js'

export class Input extends Component {
  static props = {
    type: enumerate(['text', 'number', 'email', 'tel', 'url']),
    placeholder: ifexist(String),
    value: enumerate([String, Number]),
    onChange: false,
    onFocus: false,
    onBlur: false,
    onSelect: false,
  }
  static defaultProps = {
    type: 'text',
  }
}
export default Input
