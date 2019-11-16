import Component from '../core/component.js'
import { Picker } from 'react-native'
import { Any, list, ifexist } from '../core/types.js'
import { noop } from '../core/utils.js'

export class Select extends Component {
  static props = {
    value: Any,
    options: list([{
      text: String,
      value: Any,
      disabled: ifexist(Boolean),
    }]),
    placeholder: ifexist(String),
  }
  static defaultProps = {
    onChange: noop,
  }
  render() {
    const { value, placeholder, options, readOnly, disabled, ...rest } = this.attrs
    const enabled = !readOnly && !disabled

    const onChange = (e) => {
      const value = e.target.value
      this.attrs.value = value
      this.onChange$.next(e)
    }

    return <Picker
      {...rest}

      selectedValue={value}
      onValueChange={onChange}
      enabled={enabled}
      prompt={placeholder}

      className={this.className}
      style={this.style}
    >
      {options.map(item => item.disabled ? null : <Picker.Item key={item.value} value={item.value} label={item.text}></Picker.Item>)}
    </Picker>
  }
}
export default Select
