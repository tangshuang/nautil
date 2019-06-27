import { createProxy, assign, parse, remove, clone, isEqual } from '../core/utils.js'

const dispatch = Symbol('dispatch')
const listeners = Symbol('listeners')
const cache = Symbol('cache')

export class Store {
  constructor(data = {}) {
    this[listeners] = []
    this.data = data
    this[cache] = clone(data)

    this.init(data)
  }
  init(data) {
    this.state = createProxy(data, {
      set: ([data, keyPath, value]) => this.set(keyPath, value),
      del: ([data, keyPath]) => this.del(keyPath),
    })
  }
  set(keyPath, value) {
    const oldValue = parse(this.data, keyPath)
    assign(this.data, keyPath, value)
    this[dispatch](keyPath, value, oldValue)
  }
  get(keyPath) {
    return parse(this.data, keyPath)
  }
  del(keyPath) {
    const oldValue = parse(this.data, keyPath)
    remove(this.data, keyPath)
    this[dispatch](keyPath, undefined, oldValue)
  }
  watch(keyPath, fn, deep = false) {
    const items = this[listeners]
    items.push({ keyPath, fn, deep })
    return this
  }
  unwatch(keyPath, fn) {
    const items = this[listeners]
    items.forEach((item, i) => {
      if (item.keyPath === keyPath && (item.fn === fn || fn === undefined)) {
        items.splice(i, 1)
      }
    })
    return this
  }
  [dispatch](keyPath, newValue, oldValue) {
    if (isEqual(newValue, oldValue)) {
      return
    }

    const items = this[listeners]

    const callbacks = items.filter((item) => {
      if (item.keyPath === keyPath) {
        return true
      }
      if (item.deep && keyPath.indexOf(item.keyPath + '.') === 0) {
        return true
      }
      return false
    })
    callbacks.forEach(({ fn }) => {
      fn.call(this, newValue, oldValue)
    })

    const newData = this.data
    const oldData = this[cache]

    const emitters = items.filter(item => item.keyPath === '*')
    emitters.forEach(({ fn }) => {
      fn.call(this, newData, oldData, [keyPath, newValue, oldValue])
    })

    assign(this[cache], keyPath, clone(newValue))
  }
}

export default Store
