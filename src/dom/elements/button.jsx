import React from 'react'
import { mixin } from 'ts-fns'
import Button from '../../lib/elements/button.jsx'

mixin(Button, class {
  render() {
    const isTouchable = (typeof document !== 'undefined' && 'ontouchmove' in document)
    return <button
      {...this.attrs}

      onClick={e => this.emit('Hint', e)}

      onMouseDown={e => !isTouchable && this.emit('HintStart', e)}
      onMouseUp={e => !isTouchable && this.emit('HintEnd', e)}

      onTouchStart={e => isTouchable && this.emit('HintStart', e)}
      onTouchEnd={e => isTouchable && this.emit('HintEnd', e)}

      className={this.className}
      style={this.style}
    >{this.children}</button>
  }
})

export { Button }
export default Button
