import Component from '../core/component.js'
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
    const { line, placeholder, value, ...rest } = this.attrs

    const onChange = (e) => {
      const value = e.target.value
      this.attrs.value = value
      this.onChange$.next(e)
    }

    return <textarea
      {...rest}

      placeholder={placeholder}
      row={line}
      value={value}

      onChange={onChange}
      onFocus={e => this.onFocus$.next(e)}
      onBlur={e => this.onBlur$.next(e)}
      onSelect={e => this.onSelect$.next(e)}

      className={this.className}
      style={this.style}
    ></textarea>
  }
}
export default Textarea
