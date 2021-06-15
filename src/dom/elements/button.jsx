import { mixin } from 'ts-fns'
import Button from '../../lib/elements/button.jsx'

const isTouchable = (typeof document !== 'undefined' && 'ontouchmove' in document)

mixin(Button, class {
  render() {
    return <button
      {...this.attrs}

      onClick={e => this.dispatch('Hit', e)}

      onMouseDown={e => !isTouchable && this.dispatch('HitStart', e)}
      onMouseUp={e => !isTouchable && this.dispatch('HitEnd', e)}

      onTouchStart={e => isTouchable && this.dispatch('HitStart', e)}
      onTouchEnd={e => isTouchable && this.dispatch('HitEnd', e)}

      className={this.className}
      style={this.style}
    >{this.children}</button>
  }
})

export { Button }
export default Button
