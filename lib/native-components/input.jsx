import Component from '../core/component.js'
import { TextInput } from 'react-native'

export class Input extends Component {
  render() {
    const { type, placeholder, value, readOnly, disabled, ...rest } = this.attrs
    const { $value } = this.props
    const editable = !readOnly && !disabled

    const onChange = (e) => {
      if ($value) {
        const value = e.target.value
        this.attrs.value = value
      }
      this.onChange$.next(e)
    }

    return <TextInput
      {...props}

      textContentType={type}
      placeholder={placeholder}
      value={value}

      editable={editable}

      onChange={onChange}
      onFocus={e => this.onFocus$.next(e)}
      onBlur={e => this.onBlur$.next(e)}
      onSelectionChange={e => this.onSelect$.next(e)}

      className={className}
      style={style}
    ></TextInput>
  }
}
export default Input
