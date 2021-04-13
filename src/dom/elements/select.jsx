import React, { createRef } from 'react'
import { mixin } from 'ts-fns'
import Select from '../../lib/elements/select.jsx'
import { isRef } from '../../lib/utils.js'

mixin(Select, class {
  init() {
    this.state = {
      changed: false,
    }
    this.handleChange = (e) => {
      this.setState({ changed: true })
      const { onChange } = this.props
      onChange && onChange(e)
    }
  }

  render() {
    const { inputRef, options, optionValueKey, optionTextKey, ...attrs } = this.attrs

    const placeholder = attrs.placeholder
    let hasPlaceholder = typeof placeholder !== 'undefined'
    let isPlaceholderSelected = false

    // 迫使placeholder生效
    if (hasPlaceholder && !this.state.changed) {
      if ('value' in attrs) {
        const { value } = attrs
        const selected = options.some(item => item.value === value)
        if (!selected) {
          attrs.value = ''
          isPlaceholderSelected = true
        }
      }
      else if ('defaultValue' in attrs) {
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
    }

    if (hasPlaceholder) {
      delete attrs.placeholder
    }

    if (this.state.changed) {
      isPlaceholderSelected = false
      hasPlaceholder = false
    }

    if (isPlaceholderSelected) {
      attrs['data-non-selected'] = true
    }

    return (
      <select
        {...attrs}
        className={this.className}
        style={this.style}
        onChange={this.handleChange}
        ref={el => isRef(inputRef) && (inputRef.current = el)}
      >
        {hasPlaceholder ? <option disabled hidden value="">{placeholder || ''}</option> : null}
        {options ? options.map(option => <option key={optionValueKey ? option[optionValueKey] : option.value} value={optionValueKey ? option[optionValueKey] : option.value} hidden={option.hidden} disabled={option.disabled}>{optionTextKey ? option[optionTextKey] : option.text}</option>) : this.children}
      </select>
    )
  }
})

export { Select }
export default Select
