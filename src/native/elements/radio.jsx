import { mixin } from 'ts-fns'
import Radio from '../../lib/elements/radio.jsx'
import { View } from 'react-native'

mixin(Radio, class {
  render() {
    const { checked, ...rest } = this.attrs

    const onChange = (e) => {
      this.$attrs.checked = !checked

      if (checked) {
        this.dispatch('Uncheck', e)
      }
      else {
        this.dispatch('Check', e)
      }
    }

    return (
      <View
        {...rest}
        style={{
          height: 24,
          width: 24,
          borderRadius: 12,
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
            borderRadius: 6,
            backgroundColor: color,
          }}/> : null
        }
      </View>
    )
  }
})

export { Radio }
export default Radio
