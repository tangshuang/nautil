import { mixin, decideby } from 'ts-fns'
import { Select } from '../../lib/elements/select.jsx'
import { isRef } from '../../lib/utils.js'
import { Style } from '../../lib/style/style.js'

mixin(Select, class {
  render() {
    const { inputRef, options, optionValueKey, optionTextKey, placeholder, ...attrs } = this.attrs
    const value = 'value' in attrs ? attrs.value : 'defaultValue' in attrs ? defaultValue : ''
    const text = decideby(() => {
      if (value) {
        const item = options.find(item => item[optionValueKey || 'value'] === value)
        if (item) {
          return optionTextKey ? item[optionTextKey] : item.text
        }
      }
      return ''
    })
    const onChange = (e) => {
      const value = e.target.value
      const item = options.find(item => item[optionValueKey || 'value'] + '' === value)
      this.$attrs.value = item[optionValueKey || 'value']
      this.dispatch('Change', e)
    }

    return (
      <picker
        {...attrs}
        mode="selector"
        range={options}
        range-key={optionValueKey || 'value'}
        class={this.className}
        style={Style.stringify(this.style)}
        bindchange={onChange}
        value={value}
        ref={el => isRef(inputRef) && (inputRef.current = el)}
      >
        {!value && placeholder ? <view><text>{placeholder}</text></view> : null}
        {value ? <view><text>{text}</text></view> : null}
      </picker>
    )
  }
})

export { Select }
export default Select
