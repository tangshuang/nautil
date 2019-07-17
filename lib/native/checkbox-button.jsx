import { View } from 'react-native'
import Component from '../core/component.js'

export class CheckboxButton extends Component {
  render() {
    const { color = '#333333', checked, onChange, style = {} } = this.attrs
    return (
        <View style={{
          height: 24,
          width: 24,
          borderWidth: 2,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }} onResponderRelease={onChange}>
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
export default CheckboxButton
