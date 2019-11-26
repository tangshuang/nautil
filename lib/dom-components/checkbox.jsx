import Component from '../core/component.js'
import { noop } from '../utils.js'

export class Checkbox extends Component {
  static props = {
    checked: Boolean,
  }
  static defaultProps = {
    checked: false,

    onCheck: noop,
    onUncheck: noop,
  }
  render() {
    const { checked, ...rest } = this.attrs

    const onChange = (e) => {
      this.attrs.checked = !checked

      if (checked) {
        this.onUncheck$.next(e)
      }
      else {
        this.onCheck$.next(e)
      }
    }

    return <input type="checkbox"
      {...rest}

      checked={checked}
      onChange={onChange}

      className={this.className}
      style={this.style}
    />
  }
}
export default Checkbox
