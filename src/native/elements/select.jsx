import React from 'react'
import { Picker } from 'react-native'
import { mixin } from 'ts-fns'
import Select from '../../lib/elements/select.jsx'

mixin(Select, class {
  render() {
    const { value, placeholder, options, readOnly, disabled, ...rest } = this.attrs
    const enabled = !readOnly && !disabled

    const onChange = (e) => {
      const value = e.target.value
      this.attrs.value = value
      this.emit('Change', e)
    }

    return (
      <Picker
        {...rest}

        selectedValue={value}
        onValueChange={onChange}
        enabled={enabled}
        prompt={placeholder}

        className={this.className}
        style={this.style}
      >
        {options.map(item => item.disabled ? null : <Picker.Item key={item.value} value={item.value} label={item.text}></Picker.Item>)}
      </Picker>
    )
  }
})

export { Select }
export default Select
