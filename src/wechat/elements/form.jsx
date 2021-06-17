import { mixin } from 'ts-fns'
import { Form } from '../../lib/elements/form.jsx'
import { Style } from '../../lib/style/style.js'

mixin(Form, class {
  render() {
    return <form
      {...this.attrs}

      bindchange={e => this.dispatch('Change', e)}
      bindreset={e => this.dispatch('Reset', e)}
      bindsubmit={e => this.dispatch('Submit', e)}

      class={this.className}
      style={Style.stringify(this.style)}
    >{this.children}</form>
  }
})

export { Form }
export default Form
