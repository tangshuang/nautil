import React from 'react'
import { mixin } from 'ts-fns'
import Section from '../../lib/elements/section.jsx'

const isTouchable = (typeof document !== 'undefined' && 'ontouchmove' in document)

mixin(Section, class {
  render() {
    return <div
      {...this.attrs}

      onClick={e => this.emit('Hit', e)}

      onMouseDown={e => !isTouchable && this.emit('HitStart', e)}
      onMouseMove={e => !isTouchable && this.emit('HitMove', e)}
      onMouseUp={e => !isTouchable && this.emit('HitEnd', e)}

      onTouchStart={e => isTouchable && this.emit('HitStart', e)}
      onTouchMove={e => isTouchable && this.emit('HitMove', e)}
      onTouchEnd={e => isTouchable && this.emit('HitEnd', e)}
      onTouchCancel={e => isTouchable && this.emit('HitCancel', e)}

      className={this.className}
      style={this.style}
    >{this.children}</div>
  }
})

export { Section }
export default Section
