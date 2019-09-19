import Component from '../core/component.js'
import { Any, list, ifexist } from '../core/types.js'
import { noop } from '../core/utils.js'

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

      className,
      style,
      attrs,
    } = this
    const { value, bind, placeholder, options, ...props } = attrs

    const onChange = (e) => {
      if (bind) {
        const value = e.target.value
        assign(bind[0], bind[1], value)
      }
      onChange$.next(e)
    }

    const useValue = bind ? parse(bind[0], bind[1]) : value

    return <select
      {...props}

      value={useValue}
      onChange={onChange}

      className={className}
      style={style}>
      {placeholder ? <option disabled hidden style={{ display: 'none' }}>{placeholder}</option> : null}
      {options.map(item => <option key={item.value} value={item.value} disabled={item.disabled}>{item.text}</option>)}
    </select>
  }
}
export default Select
