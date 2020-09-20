import React from 'react'
import { mixin } from 'ts-fns'
import Checkbox from '../../lib/elements/checkbox.jsx'

mixin(Checkbox, class {
  render() {
    const { checked, ...rest } = this.attrs

    const onChange = (e) => {
      this.attrs.checked = !checked

      if (checked) {
        this.emit('Uncheck', e)
      }
      else {
        this.emit('Check', e)
      }
    }

    return <input type="checkbox"
      {...rest}

      checked={checked}
      onChange={onChange}

      className={this.className}
      style={this.style}
    />
  }
})

export { Checkbox }
export default Checkbox
