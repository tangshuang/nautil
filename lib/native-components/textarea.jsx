import Component from '../core/component.js'
import { TextInput } from 'react-native'

export class Textarea extends Component {
  render() {
    const { line, placeholder, value, readOnly, disabled, ...rest } = this.attrs
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
      {...rest}

      multiline={true}
      placeholder={placeholder}
      numberOfLines={line}
      value={value}

      editable={editable}

      onChange={onChange}
      onFocus={e => this.onFocus$.next(e)}
      onBlur={e => this.onBlur$.next(e)}
      onSelectionChange={e => this.onSelect$.next(e)}

      className={this.className}
      style={this.style}
    ></TextInput>
  }
}
export default Textarea
