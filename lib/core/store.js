import { createProxy, assign, parse, remove, clone, isEqual, each } from '../core/utils.js'

export class Store {
  constructor(data = {}) {
    this.data = data

    this._listeners = []
    this._cache = clone(data)

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
    this._dispatch(keyPath, value, oldValue)
    return this
  }
  get(keyPath) {
    return parse(this.data, keyPath)
  }
  del(keyPath) {
    const oldValue = parse(this.data, keyPath)
    remove(this.data, keyPath)
    this._dispatch(keyPath, undefined, oldValue)
    return this
  }
  update(data) {
    each(data, (value, keyPath) => this.set(keyPath, value))
    return this
  }
  watch(keyPath, fn, deep = false) {
    const items = this._listeners
    items.push({ keyPath, fn, deep })
    return this
  }
  unwatch(keyPath, fn) {
    const items = this._listeners
    items.forEach((item, i) => {
      if (item.keyPath === keyPath && (item.fn === fn || fn === undefined)) {
        items.splice(i, 1)
      }
    })
    return this
  }
  _dispatch(keyPath, newValue, oldValue) {
    if (isEqual(newValue, oldValue)) {
      return
    }

    const items = this._listeners

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
    const oldData = this._cache

    const emitters = items.filter(item => item.keyPath === '*')
    emitters.forEach(({ fn }) => {
      fn.call(this, newData, oldData, [keyPath, newValue, oldValue])
    })

    assign(this._cache, keyPath, clone(newValue))
  }
}

export default Store
