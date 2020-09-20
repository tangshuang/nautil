import React from 'react'
import { mixin } from 'ts-fns'
import Textarea from '../../lib/elements/textarea.jsx'

mixin(Textarea, class {
  render() {
    const { line, placeholder, value, ...rest } = this.attrs

    const onChange = (e) => {
      const value = e.target.value
      this.attrs.value = value
      this.emit('Change', e)
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
})

export { Textarea }
export default Textarea
