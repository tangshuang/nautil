import React from 'react'
import { mixin } from 'ts-fns'

import SwipeSection from '../../lib/elements/swipe-section.jsx'
import Section from '../../lib/elements/section.jsx'

mixin(SwipeSection, class {
  onInit() {
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.onTouchCancel = this.onTouchCancel.bind(this)

    if (this.props.throttle) {
      this.onTouchMove = throttle(this.onTouchMove, this.props.throttle)
    }

    this.touchStartX = 0
    this.startX = 0
    this.started = false
  }

  onTouchStart(e) {
    const { clientX } = e.changedTouches[0]
    this.startX = clientX
  }

  onTouchMove(e) {
    const { clientX: currentX } = e.changedTouches[0]
    const { touchStartX, startX } = this
    const { sensitivity, distance, disabled } = this.attrs
    const touchMoveX = currentX - touchStartX

    if (disabled) {
      return
    }

    if (!this.started && this.isReached(touchMoveX, sensitivity)) {
      this.emit('Start', { startX: currentX })
      this.startX = currentX
      this.started = true
    }
    else if (this.started) {
      const moveX = currentX - startX
      this.emit('Move', { moveX, startX, currentX })

      // 当达到了可以执行 onEnd 的位置
      if (this.isReached(moveX, distance)) {
        this.emit('Reach', { moveX, startX, currentX })
      }
      // 未达到指定位置
      else {
        this.emit('Unreach', { moveX, startX, currentX })
      }
    }
  }

  isReached(moveX, target) {
    const { direction } = this.attrs
    const res = direction === 'right' ? moveX >= target
      : direction === 'left' ? -moveX >= target
      : Math.abs(moveX) >= target
    return res
  }

  onTouchEnd(e) {
    const { clientX: currentX } = e.changedTouches[0]
    const { startX } = this
    const { distance, disabled } = this.attrs
    const moveX = currentX - startX

    if (this.isReached(moveX, distance)) {
      if (!disabled) {
        this.emit('End', { moveX, startX, currentX })
      }
      else {
        this.emit('Cancel', { moveX, startX, currentX })
      }
    }
    else {
      this.emit('Cancel', { moveX, startX, currentX })
    }

    this.startX = 0
    this.started = false
  }

  onTouchCancel(e) {
    const { clientX: currentX } = e.changedTouches[0]
    const { startX } = this
    const moveX = currentX - startX

    this.emit('Cancel', { moveX, startX, currentX })

    this.startX = 0
    this.started = false
  }

  render() {
    const { sensitivity, distance, direction, disabled, ...rest } = this.attrs
    return (
      <Section
        {...rest}
        onHintStart={this.onTouchStart}
        onHintMove={this.onTouchMove}
        onHintEnd={this.onTouchEnd}
        onHintCancel={this.onTouchCancel}
        style={this.style}
      >{this.children}</Section>
    )
  }
})

export { SwipeSection }
export default SwipeSection
