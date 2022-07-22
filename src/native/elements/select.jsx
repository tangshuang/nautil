import { Picker } from 'react-native'
import { Select } from '../../lib/elements/select.jsx'

Select.implement(class {
  render() {
    const { value, placeholder, options, readOnly, disabled, ...rest } = this.attrs
    const enabled = !readOnly && !disabled

    const onChange = (e) => {
      const value = e.target.value
      this.$attrs.value = value
      this.dispatch('Change', e)
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
        {options ? options.map(item => item.disabled ? null : <Picker.Item key={item.value} value={item.value} label={item.text}></Picker.Item>) : null}
      </Picker>
    )
  }
})

export { Select }
export default Select
