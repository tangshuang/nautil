import React from 'react'
import { mixin } from 'ts-fns'
import Section from '../../lib/elements/section.jsx'

const isTouchable = (typeof document !== 'undefined' && 'ontouchmove' in document)

mixin(Section, class {
  render() {
    return <div
      {...this.attrs}

      onClick={e => this.emit('Hint', e)}

      onMouseDown={e => !isTouchable && this.emit('HintStart', e)}
      onMouseMove={e => !isTouchable && this.emit('HintMove', e)}
      onMouseUp={e => !isTouchable && this.emit('HintEnd', e)}

      onTouchStart={e => isTouchable && this.emit('HintStart', e)}
      onTouchMove={e => isTouchable && this.emit('HintMove', e)}
      onTouchEnd={e => isTouchable && this.emit('HintEnd', e)}
      onTouchCancel={e => isTouchable && this.emit('HintCancel', e)}

      className={this.className}
      style={this.style}
    >{this.children}</div>
  }
})

export { Section }
export default Section
