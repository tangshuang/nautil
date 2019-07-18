import Etx from 'etx'
import { tween } from './tween.js'

// https://gist.github.com/gre/1650294
// https://easings.net/
export const easings = {
  // no easing, no acceleration
  linear: t => t,
  // accelerating from zero velocity
  easeInQuad: t => t*t,
  // decelerating to zero velocity
  easeOutQuad: t => t*(2-t),
  // acceleration until halfway, then deceleration
  easeInOutQuad: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
  // accelerating from zero velocity
  easeInCubic: t => t*t*t,
  // decelerating to zero velocity
  easeOutCubic: t => (--t)*t*t+1,
  // acceleration until halfway, then deceleration
  easeInOutCubic: t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
  // accelerating from zero velocity
  easeInQuart: t => t*t*t*t,
  // decelerating to zero velocity
  easeOutQuart: t => 1-(--t)*t*t*t,
  // acceleration until halfway, then deceleration
  easeInOutQuart: t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
  // accelerating from zero velocity
  easeInQuint: t => t*t*t*t*t,
  // decelerating to zero velocity
  easeOutQuint: t => 1+(--t)*t*t*t*t,
  // acceleration until halfway, then deceleration
  easeInOutQuint: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t,
  // elastic bounce effect at the beginning
  easeInElastic: t => (.04 - .04 / t) * Math.sin(25 * t) + 1,
  // elastic bounce effect at the end
  easeOutElastic: t => .04 * t / (--t) * Math.sin(25 * t),
  // elastic bounce effect at the beginning and end
  easeInOutElastic: t => (t -= .5) < 0 ? (.02 + .01 / t) * Math.sin(50 * t) : (.02 - .01 / t) * Math.sin(50 * t) + 1,
  easeInSin: t => 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2),
  easeOutSin: t => Math.sin(Math.PI / 2 * t),
  easeInOutSin: t => (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2,
}

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
