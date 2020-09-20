import React from 'react'
import { mixin } from 'ts-fns'
import Input from '../../lib/elements/input.jsx'

mixin(Input, class {
  render() {
    const { type, ...rest } = this.attrs

    const onChange = (e) => {
      const value = e.target.value
      this.attrs.value = type === 'number' || type === 'range' ? +value : value
      this.emit('Change', e)
    }

    return <input
      {...rest}

      type={type}

      onChange={onChange}
      onFocus={e => this.emit('Focus', e)}
      onBlur={e => this.emit('Blur', e)}
      onSelect={e => this.emit('Select', e)}

      className={this.className}
      style={this.style}
    />
  }
})

export { Input }
export default Input
