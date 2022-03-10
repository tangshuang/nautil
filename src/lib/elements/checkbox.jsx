import Component from '../core/component.js'

export class Checkbox extends Component {
  static props = {
    checked: Boolean,
    onChange: false,
    onCheck: false,
    onUncheck: false,
  }
  static defaultProps = {
    checked: false,
  }
}
export default Checkbox
