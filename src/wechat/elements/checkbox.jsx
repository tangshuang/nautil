import { mixin } from 'ts-fns'
import Checkbox from '../../lib/elements/checkbox.jsx'
import { Style } from '../../lib/style/style.js'

mixin(Checkbox, class {
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

    return <input type="checkbox"
      {...rest}

      checked={checked}
      bindchange={onChange}

      style={Style.stringify(this.style)}
    />
  }
})

export { Checkbox }
export default Checkbox
