import React from 'react'
import { mixin } from 'ts-fns'
import Select from '../../lib/elements/select.jsx'

mixin(Select, class {
  render() {
    const { value, placeholder, options, ...rest } = this.attrs

    const onChange = (e) => {
      const value = e.target.value
      this.attrs.value = value
      this.emit('Change', e)
    }

    return (
      <select
        {...rest}

        value={value}
        onChange={onChange}

        className={this.className}
        style={this.style}
      >
        {placeholder ? <option disabled hidden style={{ display: 'none' }}>{placeholder}</option> : null}
        {options.map(item => <option key={item.value} value={item.value} disabled={item.disabled}>{item.text}</option>)}
      </select>
    )
  }
})

export { Select }
export default Select
