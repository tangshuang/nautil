import { mixin } from 'ts-fns'
import { Button } from '../../lib/elements/button.jsx'
import { Style } from '../../lib/style/style.js'

mixin(Button, class {
  render() {
    const { type: _type, ...attrs } = this.attrs
    return <button
      {...attrs}

      bindtap={e => this.dispatch('Hit', e)}
      bindtapstart={e => this.dispatch('HitStart', e)}
      bindtapend={e => this.dispatch('HitEnd', e)}

      class={this.className}
      style={Style.stringify(this.style)}
    >{this.children}</button>
  }
})

export { Button }
export default Button
