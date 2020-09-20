import Component from '../core/component.js'
import { noop } from '../core/utils.js'

export class Form extends Component {
  static props = {
    onChange: Function,
    onReset: Function,
    onSubmit: Function,
  }
  static defaultProps = {
    onChange: noop,
    onReset: noop,
    onSubmit: noop,
  }
}
export default Form
