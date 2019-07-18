import Etx from 'etx'
import { tween } from './tween.js'
import easings from './easings.js'

export class Transition extends Etx {
  constructor(options = {}) {
    super()

    const { ease = 'linear', start = 0, end = 1, duration = 0, loop = false } = options

    this._ease = ease
    this._start = start
    this._end = end
    this._duration = duration
    this._loop = loop
    this.current = start

    this.status = -1
    this._time = 0
  }
  animate() {
    if (this.status < 1) {
      return
    }

    const currentTime = Date.now()
    const t = (currentTime - this._time) / this._duration
    const tw = t > 1 ? 1 : t < 0 ? 0 : t
    const easing = easings[this._ease]
    const factor = easing(tw) || 0
    const end = this._end
    const start = this._start
    const value = tween(start, end, factor)

    this.current = value
    this.emit('update', value)

    if (tw === 1 && this._loop) {
      this._time = currentTime
    }
    else if (tw === 1) {
      this.stop()
      return
    }

    requestAnimationFrame(() => {
      this.animate()
    })
  }
  start() {
    if (!easings[this._ease] || this._duration <= 0) {
      const value = this._end
      this.current = value
      this.emit('update', value)
      this.stop()
      return
    }

    if (this.status > 0) {
      return
    }
    if (this.status < 0) {
      this._time = Date.now()
    }

    this.status = 1
    this.emit('start')
    this.animate()
  }
  pause() {
    if (this.status <= 0) {
      return
    }

    this.status = 0
    this.emit('pause')
  }
  stop() {
    if (this.status < 0) {
      return
    }

    this.status = -1
    this.emit('stop')
  }
}

export default Transition
