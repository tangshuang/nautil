import { ifexist } from 'tyshemo'

import Component from '../component.js'

export class Textarea extends Component {
  static props = {
    value: String,
    line: Number,
    placeholder: ifexist(String),

    onChange: false,
    onFocus: false,
    onBlur: false,
    onSelect: false,
  }
  static defaultProps = {
    line: 3,
  }
}
export default Textarea
