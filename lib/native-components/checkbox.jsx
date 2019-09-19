import Component from '../core/component.js'
import { Any, ifexist } from '../core/types.js'
import { noop } from '../core/utils.js'
import { View } from 'react-native'

export class Checkbox extends Component {
  static props = {
    checkedValue: ifexist(Any),
    uncheckedValue: ifexist(Any),

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
    const { checkedValue, uncheckedValue, bind, checked, color = '#333333', ...props } = attrs

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

    return (
      <View
        style={{
          height: 24,
          width: 24,
          borderWidth: 2,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
        onResponderRelease={onChange}
        {...props}
      >
        {
          checked ? <View style={{
            height: 12,
            width: 12,
            backgroundColor: color,
          }}/> : null
        }
      </View>
    )
  }
}
export default Checkbox
