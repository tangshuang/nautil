import Component from '../core/component.js'
import { TextInput } from 'react-native'
import { ifexist } from '../types.js'
import { noop } from '../utils.js'

export class Textarea extends Component {
  static props = {
    value: String,
    line: Number,
    placeholder: ifexist(String),
  }
  static defualtProps = {
    line: 3,

    onChange: noop,
    onFocus: noop,
    onBlur: noop,
    onSelect: noop,
  }
  render() {
    const { line, placeholder, value, readOnly, disabled, ...rest } = this.attrs
    const editable = !readOnly && !disabled

    const onChange = (e) => {
      const value = e.target.value
      this.attrs.value = value
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
