import { Select } from '../../lib/elements/select.jsx'
import { isRef } from '../../lib/utils.js'

Select.implement(class {
  render() {
    const { inputRef, options, optionValueKey, optionTextKey, ...attrs } = this.attrs

    const onChange = (e) => {
      const value = e.target.value
      const item = options.find(item => item[optionValueKey || 'value'] + '' === value)
      this.$attrs.value = item[optionValueKey || 'value']
      this.dispatch('Change', e)
    }

    const { placeholder } = attrs
    const hasPlaceholder = typeof placeholder !== 'undefined'
    let isPlaceholderSelected = false

    if (hasPlaceholder) {
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
      delete attrs.placeholder
    }

    if (isPlaceholderSelected) {
      attrs['data-non-selected'] = true
    }

    return (
      <select
        {...attrs}
        className={this.className}
        style={this.style}
        onChange={onChange}
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
