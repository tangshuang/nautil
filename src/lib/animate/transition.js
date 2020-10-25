import { tween } from './tween.js'
import easings from './easings.js'
import { noop } from '../core/utils.js'

export class Transition {
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

    this._listeners = []
  }

  on(event, callback) {
    this._listeners.push([event, callback])
  }

  emit(event, data) {
    this._listeners.forEach(([e, fn]) => {
      if (event === e) {
        fn(data)
      }
    })
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
    // finish the loop immeditately
    if (!easings[this._ease] || this._duration <= 0) {
      this.status = 1
      this.emit('start')

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

Transition.animate = animate

function animate({ ease = 'linear', start = 0, end = 1, duration = 0, onStart = noop, onUpdated = noop, onStop = noop }) {
  const tx = new Transition({ ease, start, end, duration })
  tx.on('start', onStart)
  tx.on('update', onUpdated)
  tx.on('stop', onStop)
  tx.start()
  return tx
}

export default Transition
