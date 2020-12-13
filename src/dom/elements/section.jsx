import React, { createRef } from 'react'
import { mixin } from 'ts-fns'
import Section from '../../lib/elements/section.jsx'

const isTouchable = (typeof document !== 'undefined' && 'ontouchmove' in document)

mixin(Section, class {
  onInit() {
    this._ref = createRef()
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }
  handleClickOutside(event) {
    if (!this._ref) {
      return
    }
    if (this._ref.current === event.target) {
      return
    }
    if (this._ref.current && this._ref.current.contains && this._ref.current.contains(event.target)) {
      return
    }
    if (!this.__mounted) {
      return
    }
    this.emit('HitOutside', event)
  }
  onMounted() {
    document.addEventListener('click', this.handleClickOutside, true)
    this.__mounted = true
  }
  onUnmount() {
    this.__mounted = false
    document.removeEventListener('click', this.handleClickOutside)
  }
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

      ref={this._ref}
    >{this.children}</div>
  }
})

export { Section }
export default Section
