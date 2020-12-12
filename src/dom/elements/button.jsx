import React from 'react'
import { mixin } from 'ts-fns'
import Button from '../../lib/elements/button.jsx'

const isTouchable = (typeof document !== 'undefined' && 'ontouchmove' in document)

mixin(Button, class {
  render() {
    return <button
      {...this.attrs}

      onClick={e => this.emit('Hit', e)}

      onMouseDown={e => !isTouchable && this.emit('HitStart', e)}
      onMouseUp={e => !isTouchable && this.emit('HitEnd', e)}

      onTouchStart={e => isTouchable && this.emit('HitStart', e)}
      onTouchEnd={e => isTouchable && this.emit('HitEnd', e)}

      className={this.className}
      style={this.style}
    >{this.children}</button>
  }
})

export { Button }
export default Button
