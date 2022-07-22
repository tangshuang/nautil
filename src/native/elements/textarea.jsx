import { TextInput } from 'react-native'
import { Textarea } from '../../lib/elements/textarea.jsx'

Textarea.implement(class {
  render() {
    const { line, placeholder, value, readOnly, disabled, ...rest } = this.attrs
    const editable = !readOnly && !disabled

    const onChange = (e) => {
      const value = e.target.value
      this.$attrs.value = value
      this.dispatch('Change', e)
    }

    return (
      <TextInput
        {...rest}

        multiline={true}
        placeholder={placeholder}
        numberOfLines={line}
        value={value}

        editable={editable}

        onChange={onChange}
        onFocus={e => this.dispatch('Focus', e)}
        onBlur={e => this.dispatch('Blur', e)}
        onSelectionChange={e => this.dispatch('Select', e)}

        className={this.className}
        style={this.style}
      ></TextInput>
    )
  }
})

export { Textarea }
export default Textarea
