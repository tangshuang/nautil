import { mixin } from 'ts-fns'
import { Textarea } from '../../lib/elements/textarea.jsx'
import { Style } from '../../lib/style/style.js'

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

      bindchange={onChange}
      bindfocus={e => this.dispatch('Focus', e)}
      bindblur={e => this.dispatch('Blur', e)}
      bindselect={e => this.dispatch('Select', e)}

      class={this.className}
      style={Style.stringify(this.style)}
    ></textarea>
  }
})

export { Textarea }
export default Textarea
