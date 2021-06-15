import { mixin } from 'ts-fns'
import { TextInput } from 'react-native'
import Input from '../../lib/elements/input.jsx'

mixin(Input, class {
  render() {
    const { type, placeholder, value, readOnly, disabled, ...rest } = this.attrs
    const editable = !readOnly && !disabled

    const onChange = (e) => {
      const value = e.target.value
      this.$attrs.value = value
      this.dispatch('Change', e)
    }

    const contentType = type === 'password' ? 'password' : 'none'
    const keyboardType = type === 'number' ? 'decimal-pad' : type === 'email' ? 'email-address' : type === 'tel' ? 'phone-pad' : 'default'

    return (
      <TextInput
        {...rest}

        keyboardType={keyboardType}
        textContentType={contentType}
        placeholder={placeholder}
        value={value}

        editable={editable}

        onChange={onChange}
        onFocus={e => this.onFocus$.next(e)}
        onBlur={e => this.onBlur$.next(e)}
        onSelectionChange={e => this.onSelect$.next(e)}

        className={this.className}
        style={this.style}
      ></TextInput>
    )
  }
})

export { Input }
export default Input
