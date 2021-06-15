import { mixin } from 'ts-fns'
import Textarea from '../../lib/elements/textarea.jsx'

mixin(Textarea, class {
  render() {
    const { line, placeholder, value, ...rest } = this.attrs

    const onChange = (e) => {
      const value = e.target.value
      this.$attrs.value = value
      this.dispatch('Change', e)
    }

    return <textarea
      {...rest}

      placeholder={placeholder}
      row={line}
      value={value}

      onChange={onChange}
      onFocus={e => this.dispatch('Focus', e)}
      onBlur={e => this.dispatch('Blur', e)}
      onSelect={e => this.dispatch('Select', e)}

      className={this.className}
      style={this.style}
    ></textarea>
  }
})

export { Textarea }
export default Textarea
