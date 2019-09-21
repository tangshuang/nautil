import Component from '../core/component.js'
import { Any, ifexist } from '../core/types.js'
import { noop } from '../core/utils.js'

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
    const { value, bind, checked, ...props } = attrs

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

    return <input type="radio"
      {...props}

      checked={isChecked}
      onChange={onChange}

      className={className}
      style={style} />
  }
}
export default Radio
