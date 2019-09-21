import Component from '../core/component.js'
import { ifexist } from '../core/types.js'
import { noop } from '../core/utils.js'
import { TextInput } from 'react-native'

export class Textarea extends Component {
  static props = {
    value: ifexist(String),
    // model: ifexist(String),

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
    const {
      onChange$,
      onFocus$,
      onBlur$,
      onSelect$,

      className,
      style,
      attrs,
    } = this
    const { line, placeholder, value, bind, readOnly, disabled, ...props } = attrs

    const onChange = (e) => {
      if (bind) {
        const value = e.target.value
        assign(bind[0], bind[1], value)
      }
      onChange$.next(e)
    }

    const useValue = bind ? parse(bind[0], bind[1]) : value
    const editable = !readOnly && !disabled

    return <TextInput
      {...props}

      multiline={true}
      placeholder={placeholder}
      numberOfLines={line}
      value={useValue}

      editable={editable}

      onChange={onChange}
      onFocus={e => onFocus$.next(e)}
      onBlur={e => onBlur$.next(e)}
      onSelectionChange={e => onSelect$.next(e)}

      className={className}
      style={style}></TextInput>
  }
}
export default Textarea
