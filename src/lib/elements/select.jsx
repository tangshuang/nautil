import { Any, list, ifexist } from 'tyshemo'

import Component from '../core/component.js'

export class Select extends Component {
  static props = {
    options: ifexist(list([{
      text: String,
      value: Any,
      disabled: ifexist(Boolean),
    }])),
    placeholder: ifexist(String),
    value: ifexist(Any),
    onChange: false,
  }
}
export default Select
