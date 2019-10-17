import Component from '../core/component.js'
import { throttle, createRef } from '../core/utils.js'

export class SwipeSection extends Component {
  onMount() {
    this.dom = createRef()

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.onTouchCancel = this.onTouchCancel.bind(this)

    if (this.attrs.throttle) {
      this.onTouchMove = throttle(this.onTouchMove, this.attrs.throttle)
    }

    this.touchStartX = 0
    this.startX = 0
    this.started = false
  }

  onMounted() {
    const { current } = this.dom
    current.addEventListener('touchstart', this.onTouchStart)
    current.addEventListener('touchmove', this.onTouchMove)
    current.addEventListener('touchend', this.onTouchEnd)
    current.addEventListener('touchcancel', this.onTouchCancel)
  }

  onUnmount() {
    const { current } = this.dom
    current.removeEventListener('touchstart', this.onTouchStart)
    current.removeEventListener('touchmove', this.onTouchMove)
    current.removeEventListener('touchend', this.onTouchEnd)
    current.removeEventListener('touchcancel', this.onTouchCancel)
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
      this.onStart$.next({ startX: currentX })
      this.startX = currentX
      this.started = true
    }
    else if (this.started) {
      const moveX = currentX - startX
      this.onMove$.next({ moveX, startX, currentX })

      // 当达到了可以执行 onEnd 的位置
      if (this.isReached(moveX, distance)) {
        this.onReach$.next({ moveX, startX, currentX })
      }
      // 未达到指定位置
      else {
        this.onUnreach$.next({ moveX, startX, currentX })
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
        this.onEnd$.next({ moveX, startX, currentX })
      }
      else {
        this.onCancel$.next({ moveX, startX, currentX })
      }
    }
    else {
      this.onCancel$.next({ moveX, startX, currentX })
    }

    this.startX = 0
    this.started = false
  }

  onTouchCancel(e) {
    const { clientX: currentX } = e.changedTouches[0]
    const { startX } = this
    const moveX = currentX - startX

    this.onCancel$.next({ moveX, startX, currentX })

    this.startX = 0
    this.started = false
  }

  render() {
    const { sensitivity, distance, direction, disabled, ...rest } = this.attrs
    return (
      <div {...rest} ref={this.dom}>{this.children}</div>
    )
  }
}

export default Swipe
