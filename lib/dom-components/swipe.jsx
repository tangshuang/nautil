import { Component, createRef } from 'react'
import { noop } from '../core/utils.js'

export class Swipe extends Component {
  static defaultProps = {
    sensitivity: 5,
    distance: 100,
    onStart: noop,
    onMove: noop,
    onEnd: noop,
    onCancel: noop,
    onReach: noop,
    onUnreach: noop,
  }
  constructor(props) {
    super(props)
    this.dom = createRef()

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.onTouchCancel = this.onTouchCancel.bind(this)

    this.touchStartX = 0
    this.startX = 0
    this.started = false
  }

  componentDidMount() {
    const { current } = this.dom
    current.addEventListener('touchstart', this.onTouchStart)
    current.addEventListener('touchmove', this.onTouchMove)
    current.addEventListener('touchend', this.onTouchEnd)
    current.addEventListener('touchcancel', this.onTouchCancel)
  }

  componentWillUnmount() {
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
    const { onStart, onMove, onReach, onUnreach, sensitivity, distance } = this.props
    const touchMoveX = currentX - touchStartX

    if (!this.started && this.isReached(touchMoveX, sensitivity)) {
      onStart({ currentX })
      this.startX = currentX
      this.started = true
    }
    else if (this.started) {
      const moveX = currentX - startX
      onMove({ moveX, startX, currentX })

      // 当达到了可以执行 onEnd 的位置
      if (this.isReached(moveX, distance)) {
        onReach({ moveX, startX, currentX })
      }
      // 未达到指定位置
      else {
        onUnreach({ moveX, startX, currentX })
      }
    }
  }

  isReached(moveX, target) {
    const { direction } = this.props
    const res = direction === 'right' ? moveX >= target
      : direction === 'left' ? -moveX >= target
      : Math.abs(moveX) >= target
    return res
  }

  onTouchEnd(e) {
    const { clientX: currentX } = e.changedTouches[0]
    const { startX } = this
    const { distance, onEnd, onCancel } = this.props
    const moveX = currentX - startX

    if (this.isReached(moveX, distance)) {
      onEnd({ moveX, startX, currentX })
    }
    else {
      onCancel({ moveX, startX, currentX })
    }

    this.startX = 0
    this.started = false
  }

  onTouchCancel(e) {
    const { clientX: currentX } = e.changedTouches[0]
    const { startX } = this
    const { onCancel } = this.props
    const moveX = currentX - startX
    onCancel({ moveX, startX, currentX })

    this.startX = 0
    this.started = false
  }

  render() {
    const { children, onStart, onMove, onEnd, onCancel, onReach, onUnreach, ...props } = this.props
    return (
      <div {...props} ref={this.dom}>{children}</div>
    )
  }
}

export default Swipe
