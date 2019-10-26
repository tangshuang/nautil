import Component from '../core/component.js'
import { TextInput } from 'react-native'
import { enumerate, ifexist } from '../core/types.js'
import { noop } from '../core/utils.js'

export class Input extends Component {
  static props = {
    type: enumerate([ 'text', 'number', 'email', 'tel', 'url' ]),
    placeholder: ifexist(String),
    value: enumerate([String, Number]),
  }
  static defaultProps = {
    type: 'text',

    onChange: noop,
    onFocus: noop,
    onBlur: noop,
    onSelect: noop,
  }
  render() {
    const { type, placeholder, value, readOnly, disabled, ...rest } = this.attrs
    const editable = !readOnly && !disabled

    const onChange = (e) => {
      const value = e.target.value
      this.attrs.value = value
      this.onChange$.next(e)
    }

    const contentType = type === 'password' ? 'password' : 'none'
    const keyboardType = type === 'number' ? 'decimal-pad' : type === 'email' ? 'email-address' : type === 'tel' ? 'phone-pad' : 'default'

    return <TextInput
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
  }
}
export default Input
