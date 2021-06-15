import { mixin } from 'ts-fns'
import Radio from '../../lib/elements/radio.jsx'

mixin(Radio, class {
  render() {
    const { checked, ...rest } = this.attrs

    const onChange = (e) => {
      this.$attrs.checked = !checked

      if (checked) {
        this.dispatch('Uncheck', e)
      }
      else {
        this.dispatch('Check', e)
      }

      this.dispatch('Change', e)
    }

    return <input type="radio"
      {...rest}

      checked={checked}
      onChange={onChange}

      className={this.className}
      style={this.style}
    />
  }
})

export { Radio }
export default Radio
