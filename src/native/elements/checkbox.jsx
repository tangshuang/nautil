import React from 'react'
import { mixin } from 'ts-fns'
import { View } from 'react-native'
import Checkbox from '../../lib/elements/checkbox.jsx'

mixin(Checkbox, class {
  render() {
    const { checked, ...rest } = this.attrs
    const { color = '#888888' } = this.style

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
})

export { Checkbox }
export default Checkbox
