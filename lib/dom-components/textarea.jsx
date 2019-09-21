import Component from '../core/component.js'
import { ifexist } from '../core/types.js'
import { noop } from '../core/utils.js'

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
    const { line, placeholder, value, bind, ...props } = attrs

    const onChange = (e) => {
      if (bind) {
        const value = e.target.value
        assign(bind[0], bind[1], value)
      }
      onChange$.next(e)
    }

    const useValue = bind ? parse(bind[0], bind[1]) : value

    return <textarea
      {...props}

      placeholder={placeholder}
      row={line}
      value={useValue}

      onChange={onChange}
      onFocus={e => onFocus$.next(e)}
      onBlur={e => onBlur$.next(e)}
      onSelect={e => onSelect$.next(e)}

      className={className}
      style={style}></textarea>
  }
}
export default Textarea
