import React from 'react'
import { mixin } from 'ts-fns'
import Input from '../../lib/elements/input.jsx'

mixin(Input, class {
  render() {
    const { type, ...rest } = this.attrs

    const onChange = (e) => {
      const value = e.target.value
      this.$attrs.value = type === 'number' || type === 'range' ? +value : value
      this.dispatch('Change', e)
    }

    return <input
      {...rest}

      type={type}

      onChange={onChange}
      onFocus={e => this.dispatch('Focus', e)}
      onBlur={e => this.dispatch('Blur', e)}
      onSelect={e => this.dispatch('Select', e)}

      className={this.className}
      style={this.style}
    />
  }
})

export { Input }
export default Input
