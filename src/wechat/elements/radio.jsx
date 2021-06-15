import { mixin } from 'ts-fns'
import Radio from '../../lib/elements/radio.jsx'
import { Style } from '../../lib/style/style.js'

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

    return <radio
      {...rest}

      checked={checked}
      bindchange={onChange}

      class={this.className}
      style={Style.stringify(this.style)}
    />
  }
})

export { Radio }
export default Radio
