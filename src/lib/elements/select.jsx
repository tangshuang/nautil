import { Any, list, ifexist } from 'tyshemo'

import Component from '../component.js'

export class Select extends Component {
  static props = {
    value: Any,
    options: list([{
      text: String,
      value: Any,
      disabled: ifexist(Boolean),
    }]),
    placeholder: ifexist(String),
    onChange: false,
  }
}
export default Select
