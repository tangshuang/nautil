import React from 'react'
import { mixin } from 'ts-fns'
import Form from '../../lib/elements/form.jsx'

mixin(Form, class {
  render() {
    return <form
      {...this.attrs}

      onChange={e => this.emit('Change', e)}
      onReset={e => this.emit('Reset', e)}
      onSubmit={e => this.emit('Submit', e)}

      style={this.style}
      className={this.className}
    >{this.children}</form>
  }
})

export { Form }
export default Form
