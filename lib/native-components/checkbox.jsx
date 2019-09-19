import Component from '../core/component.js'
import { Any, ifexist } from '../core/types.js'
import { noop } from '../core/utils.js'
import CheckboxButton from '../native/checkbox-button.jsx'

export class Checkbox extends Component {
  static props = {
    checkedValue: ifexist(Any),
    uncheckedValue: ifexist(Any),
    // model: ifexist(String),

    checked: Boolean,
  }
  static defaultProps = {
    checked: false,
    onCheck: noop,
    onUncheck: noop,
  }
  render() {
    const {
      onCheck$,
      onUncheck$,

      className,
      style,
      attrs,
    } = this
    const { checkedValue, uncheckedValue, bind, checked, color, ...props } = attrs

    const isChecked = bind ? parse(bind[1], bind[2]) === checkedValue : checked
    const onChange = (e) => {
      if (bind) {
        const nextValue = isChecked ? uncheckedValue : checkedValue
        assign(bind[0], bind[1], nextValue)
      }

      if (isChecked) {
        onUncheck$.next(e)
      }
      else {
        onCheck$.next(e)
      }
    }

    return <CheckboxButton
      {...props}

      checked={isChecked}
      onChange={onChange}
      color={color}

      className={className}
      style={style}></CheckboxButton>
  }
}
export default Checkbox
