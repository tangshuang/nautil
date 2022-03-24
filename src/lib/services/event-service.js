import { Service } from '../core/service.js'

const listenersKey = Symbol()

export class EventService extends Service {
  constructor() {
    super()

    this[listenersKey] = []
  }

  on(event, fn) {
    this[listenersKey].push([event, fn])
    return this
  }

  once(event, fn) {
    this[listenersKey].push([event, fn, true])
    return this
  }

  off(event, fn) {
    this[listenersKey] = this[listenersKey].filter(item => item[0] === event && (!fn || fn === item[1]))
    return this
  }

  /**
   * @param {*} event
   * @notice we do not provide broadcast data, because we do not want you to use it as EventBus,
   * EventService is a message center, not a data post channel
   */
  emit(event) {
    this[listenersKey].forEach((item) => {
      if (event !== item[0]) {
        return
      }

      const [, fn, once] = item
      fn()
      if (once) {
        this.off(event, fn)
      }
    })
  }
}
