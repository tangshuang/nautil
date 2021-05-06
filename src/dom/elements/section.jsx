import React, { createRef } from 'react'
import { mixin } from 'ts-fns'
import Section from '../../lib/elements/section.jsx'

const isTouchable = (typeof document !== 'undefined' && 'ontouchmove' in document)

mixin(Section, class {
  init() {
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
    if (!this._isMounted) {
      return
    }
    this.dispatch('HitOutside', event)
  }
  onMounted() {
    document.addEventListener('click', this.handleClickOutside, true)
  }
  onUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  }
  render() {
    return <div
      {...this.attrs}

      onClick={e => this.dispatch('Hit', e)}

      onMouseDown={e => !isTouchable && this.dispatch('HitStart', e)}
      onMouseMove={e => !isTouchable && this.dispatch('HitMove', e)}
      onMouseUp={e => !isTouchable && this.dispatch('HitEnd', e)}

      onTouchStart={e => isTouchable && this.dispatch('HitStart', e)}
      onTouchMove={e => isTouchable && this.dispatch('HitMove', e)}
      onTouchEnd={e => isTouchable && this.dispatch('HitEnd', e)}
      onTouchCancel={e => isTouchable && this.dispatch('HitCancel', e)}

      className={this.className}
      style={this.style}

      ref={this._ref}
    >{this.children}</div>
  }
})

export { Section }
export default Section
