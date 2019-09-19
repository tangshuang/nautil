import Component from '../core/component.js'
import { Any, ifexist } from '../core/types.js'
import { noop } from '../core/utils.js'
import { View } from 'react-native'

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
    const { value, bind, checked, color = '#333333', ...props } = attrs

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

    return (
      <View
        style={{
          height: 24,
          width: 24,
          borderRadius: 12,
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
            borderRadius: 6,
            backgroundColor: color,
          }}/> : null
        }
      </View>
    )
  }
}
export default Radio
