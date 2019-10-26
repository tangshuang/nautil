import Component from '../core/component.js'
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
    const { type, placeholder, value, ...rest } = this.attrs

    const onChange = (e) => {
      const value = e.target.value
      this.attrs.value = type === 'number' || type === 'range' ? +value : value
      this.onChange$.next(e)
    }

    return <input
      {...rest}

      type={type}
      placeholder={placeholder}
      value={value}

      onChange={onChange}
      onFocus={e => this.onFocus$.next(e)}
      onBlur={e => this.onBlur$.next(e)}
      onSelect={e => this.onSelect$.next(e)}

      className={this.className}
      style={this.style}
    />
  }
}
export default Input
