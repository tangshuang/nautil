import { View } from 'react-native'
import { PureComponent } from 'react'

export class CheckboxButton extends PureComponent {
  render() {
    const { color = '#333333', checked, onChange, style = {} } = this.props
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
