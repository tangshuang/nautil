import React from 'react'
import { mixin } from 'ts-fns'
import Form from '../../lib/elements/form.jsx'

mixin(Form, class {
  render() {
    return <form
      {...this.attrs}

      onChange={e => this.dispatch('Change', e)}
      onReset={e => this.dispatch('Reset', e)}
      onSubmit={e => this.dispatch('Submit', e)}

      style={this.style}
      className={this.className}
    >{this.children}</form>
  }
})

export { Form }
export default Form
