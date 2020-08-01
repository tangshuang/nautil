import Component from '../core/component.js'
import { View } from 'react-native'
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
    const { color = '#888888' } = this.style

    const onChange = (e) => {
      this.attrs.checked = !checked

      if (checked) {
        this.onUncheck$.next(e)
      }
      else {
        this.onCheck$.next(e)
      }
    }

    return (
      <View
        {...rest}
        style={{
          height: 24,
          width: 24,
          borderWidth: 2,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          ...this.style,
        }}
        onResponderRelease={onChange}
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
