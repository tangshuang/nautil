import React from 'react'
import { mixin, inObject } from 'ts-fns'
import Select from '../../lib/elements/select.jsx'

mixin(Select, class {
  render() {
    const { children, options, ...attrs } = this.attrs

    const onChange = (e) => {
      const value = e.target.value
      this.$attrs.value = value
      this.emit('Change', e)
    }

    const placeholder = attrs.placeholder
    const hasPlaceholder = inObject('placeholder', attrs)
    let isPlaceholderSelected = false
    if (hasPlaceholder) {
      if (inObject('value', attrs)) {
        const { value } = attrs
        const selected = options.some(item => item.value === value)
        if (!selected) {
          attrs.value = ''
          isPlaceholderSelected = true
        }
      }
      else if (inObject('defaultValue', attrs)) {
        const { defaultValue } = attrs
        const selected = options.some(item => item.value === defaultValue)
        if (!selected) {
          attrs.defaultValue = ''
          isPlaceholderSelected = true
        }
      }
      else {
        attrs.defaultValue = ''
        isPlaceholderSelected = true
      }
      delete attrs.placeholder
    }

    return (
      <select
        {...attrs}

        onChange={onChange}

        className={this.className}
        style={this.style}
      >
        {hasPlaceholder ? <option disabled hidden value="">{placeholder || ''}</option> : null}
        {options ? options.map(option => <option key={option.value} value={option.value} hidden={option.hidden} disabled={option.disabled}>{option.text}</option>) : children}
      </select>
    )
  }
})

export { Select }
export default Select
