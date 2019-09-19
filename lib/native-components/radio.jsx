import Component from '../core/component.js'
import { Any, ifexist } from '../core/types.js'
import { noop } from '../core/utils.js'
import RadioButton from '../native/radio-button.jsx'

export class Radio extends Component {
  static props = {
    value: ifexist(Any),
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
    const { value, bind, checked, color, ...props } = attrs

    const isChecked = bind ? parse(bind[0], bind[1]) === value : checked
    const onChange = (e) => {
      if (bind && isChecked) {
        assign(bind[0], bind[1], value)
      }

      if (isChecked) {
        onUncheck$.next(e)
      }
      else {
        onCheck$.next(e)
      }
    }

    return <RadioButton
      {...props}

      checked={isChecked}
      onChange={onChange}
      color={color}

      className={className}
      style={style}></RadioButton>
  }
}
export default Radio
