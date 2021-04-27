import { Service } from '../service.js'

const MODES = {
  PARALLEL: 'parallel',
  SERIAL: 'serial',
  SWITCH: 'switch',
  SHIFT: 'shift',
}

export class QueueService extends Service {
  constructor() {
    super()

    this.queue = []
    this.callbacks = []
    this.fallbacks = []
    this.status = 0

    this.debounced = false
    this.throttled = false

    const options = this.options()
    this.options = {
      mode: MODES.SERIAL,
      autoStart: true, // whether to auto start when push
      delay: 0, // whether to delay start when push
      debounce: 0,
      throttle: 0,
      ...options,
    }
  }

  options() {
    return {}
  }

  /**
   * push a defer to the end of queue
   * @param {function} defer
   * @param {function} [callback]
   * @param {function} [fallback]
   * @param {function} [cancel]
   */
  push(defer, callback, fallback, cancel) {
    const item = { defer, callback, fallback, cancel }

    item.promise = new Promise((resolve, reject) => {
      item.resolve = resolve
      item.reject = reject
    })

    this.queue.push(item)

    if (this.options.autoStart) {
      this.start()
    }

    return item.promise
  }

  stop(e) {
    this.status = -1
    this.fallbacks.forEach(fn => fn(e || new Error('stop')))
    return this
  }
  clear() {
    this.queue.forEach(item => typeof item.cancel === 'function' && item.cancel(item.deferer))
    this.queue.length = 0
    return this
  }
  cancel(defer) {
    let item = this.queue.find(item => item.defer === defer)
    if (!item) {
      return this
    }

    if (typeof item.cancel === 'function') {
      item.cancel(item.deferer)
    }

    let index = this.queue.findIndex(item => item.defer === defer)
    this.queue.splice(index, 1)

    return this
  }
  end() {
    this.status = 2
    this.queue.length = 0
    this.callbacks.forEach(fn => fn())
    return this
  }
  start() {
    // convert status
    if (this.status === 2) {
      this.status = 0
    }

    // debounce to start, before delay
    if (this.options.debounce > 0 && !this.debounced) {
      clearTimeout(this.debouncer)
      this.debouncer = setTimeout(() => {
        this.debounced = true
        this.start()
        this.debounced = false
      }, this.options.debounce)
      this.debounced = false
      return
    }

    // throttle to start
    if (this.options.throttle > 0 && !this.throttled) {
      let latestTime = this.throttleLatest
      let currentTime = Date.now()
      if (latestTime && currentTime < latestTime + this.options.throttle) {
        clearTimeout(this.throttler)
        this.throttler = setTimeout(() => {
          this.throttleLatest = currentTime
          this.throttled = true
          this.start()
          this.throttled = false
        }, this.options.throttle)
      }
      else {
        this.throttleLatest = currentTime
        this.start()
      }
      this.throttled = false
      return
    }

    // delay to start, which set this.status 0.x means it's delayed to start
    if (this.options.delay > 0 && this.status >= 0 && this.status < 0.5) {
      // ensure setTimeout run only once
      if (this.status === 0) {
        setTimeout(() => {
          this.status = 0.9 // set a number which will not block the processing
          this.start()
        }, this.options.delay)
      }

      this.status = 0.1
      return
    }

    // emit all items in queue once
    if (this.options.mode === 'parallel') {
      this.queue.forEach((item) => {
        item.deferer = item.deferer || item.defer()
      })
    }

    // if queue is runing or destoryed, start will be disabled
    if (this.options.mode !== 'switch' && (this.status === 1 || this.status < -1)) {
      return
    }

    const run = () => {
      if (this.status !== 1) {
        return
      }

      // finish normally
      // or finish with cancel/clear
      if (!this.queue.length) {
        this.end()
        return
      }

      const mode = this.options.mode
      if (typeof run[mode] === 'function') {
        run[mode]()
      }
    }
    const success = (item) => (res) => {
      // clear/stop/end/cancel was run during the defer is running
      // so that there is no need to run the callbacks of this item any more
      if (this.queue.length && this.queue[0] !== item) {
        run()
        return
      }

      const { callback, resolve } = item
      if (typeof callback === 'function') {
        callback(res)
      }
      resolve(res)

      this.queue.shift()
      run()
    }
    const fail = (item) => (e) => {
      if (this.queue.length && this.queue[0] !== item) {
        run()
        return
      }

      const { fallback, reject } = item
      if (typeof fallback === 'function') {
        fallback(e)
      }
      reject(e)
      this.fallbacks.forEach(fn => fn(e))

      this.queue.shift()
      run()
    }
    // in serial
    run.serial = () => {
      const item = this.queue[0]
      const { defer } = item
      item.deferer = defer().then(success(item)).catch(fail(item))
    }
    // in parallel
    run.parallel = () => {
      const item = this.queue[0]
      const { deferer } = item

      // the item is not in the circle because of debounce or throttle
      if (!deferer) {
        return
      }

      deferer.then(success(item)).catch(fail(item))
    }

    // only use the last item
    run.switch = () => {
      const item = this.queue.pop()
      const { defer, callback, fallback, resolve, reject } = item

      // clear the queue, only leave the running one
      this.clear()
      this.queue.push(item)

      item.deferer = defer().then((res) => {
        // the item is canceled, drop it directly
        // the pushed item is running, and do not need to fire it any more
        // it means to drop this item
        if (this.queue.length && this.queue[0] !== item) {
          return
        }

        if (typeof callback === 'function') {
          callback(res)
        }
        resolve(res)

        this.end()
      }).catch((e) => {
        if (this.queue.length && this.queue[0] !== item) {
          return
        }

        if (typeof fallback === 'function') {
          fallback(e)
        }
        reject(e)

        this.fallbacks.forEach(fn => fn(e))
        this.status = 2
      })
    }

    // only use the first/latest item
    run.shift = () => {
      const item = this.queue.shift()

      // drop the other defers, only need the first one
      this.clear()
      this.queue.push(item)

      const runLatest = (item) => {
        const { defer, callback, fallback, resolve, reject } = item
        item.deferer = defer().then((res) => {
          if (this.queue.length && this.queue[0] !== item) {
            run()
            return
          }

          if (typeof callback === 'function') {
            callback(res)
          }
          resolve(res)

          if (this.queue.length) {
            const latest = this.queue.pop()

            // current one is the last one in queue, end the queue
            if (latest === item) {
              this.end()
              return
            }

            this.clear()
            this.queue.push(latest)

            runLatest(latest)
          }
          else {
            this.end()
          }
        }).catch((e) => {
          if (this.queue.length && this.queue[0] !== item) {
            run()
            return
          }

          if (typeof fallback === 'function') {
            fallback(e)
          }
          reject(e)
          this.fallbacks.forEach(fn => fn(e))

          // even though there is an error, the queue will continue
          if (this.queue.length) {
            const latest = this.queue.pop()

            // current one is the last one in queue, end the queue
            if (latest === item) {
              this.end()
              return
            }

            this.clear()
            this.queue.push(latest)

            runLatest(latest)
          }
          else {
            this.status = 2
          }
        })
      }

      runLatest(item)
    }

    this.status = 1
    run()

    return this
  }

  on(type, fn) {
    if (type === 'end') {
      this.callbacks.push(fn)
    }
    else if (type === 'error') {
      this.fallbacks.push(fn)
    }
    return this
  }

  off(type, fn) {
    if (type === 'end') {
      this.callbacks = this.callbacks.filter(item => item !== fn)
    }
    else if (type === 'error') {
      this.fallbacks = this.fallbacks.filter(item => item !== fn)
    }
    return this
  }

  destroy() {
    if (this.status > -1) {
      return
    }

    this.queue = []
    this.fallbacks = []
    this.callbacks = []
    this.status = -2
  }

  static MODES = MODES
}
export default QueueService
