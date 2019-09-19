import Component from '../core/component.js'
import { Any, list, ifexist } from '../core/types.js'
import { noop } from '../core/utils.js'
import { Picker } from 'react-native'

export class Select extends Component {
  static props = {
    value: ifexist(Any),
    // model: ifexist(String),

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
    const {
      onChange$,

      $state,

      className,
      style,
      attrs,
    } = this
    const { value, bind, placeholder, options, readOnly, disabled, ...props } = attrs

    const onChange = (e) => {
      if (bind) {
        const value = e.target.value
        assign(bind[0], bind[1], value)
      }
      onChange$.next(e)
    }

    const useValue = bind ? parse(bind[0], bind[1]) : value
    const enabled = !readOnly && !disabled

    return <Picker
      {...props}

      selectedValue={useValue}
      onValueChange={onChange}
      enabled={enabled}
      prompt={placeholder}

      className={className}
      style={style}>
      {options.map(item => item.disabled ? null : <Picker.Item key={item.value} value={item.value} label={item.text}></Picker.Item>)}
    </Picker>
  }
}
export default Select
