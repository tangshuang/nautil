import { mixin } from 'ts-fns'
import Section from '../../lib/elements/section.jsx'
import { Style } from '../../lib/style/style.js'

mixin(Section, class {
  render() {
    return <view
      {...this.attrs}

      bindtap={e => this.dispatch('Hit', e)}
      bindtapstart={e => this.dispatch('HitStart', e)}
      bindtapmove={e => this.dispatch('HitMove', e)}
      bindtapend={e => this.dispatch('HitEnd', e)}
      bindtapcancel={e => this.dispatch('HitCancel', e)}

      class={this.className}
      style={Style.stringify(this.style)}
    >{this.children}</view>
  }
})

export { Section }
export default Section
