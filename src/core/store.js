import { createProxy, assign, parse, remove, clone, each } from 'ts-fns'

const digest = Symbol('digest')
const dispatch = Symbol('dispatch')
const listeners = Symbol('listeners')
const cache = Symbol('cache')

export class Store {
  constructor(data = {}) {
    this[listeners] = []
    this.data = {}
    this.init(data)
    this[cache] = clone(this.data)
  }
  init(data) {
    const keys = Object.keys(data)
    const computed = []
    const statable = {}
    keys.forEach((key) => {

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

    const emitters = items.filter(item => item.keyPath === '*')
    const newData = this.data
    const oldData = this[cache]
    emitters.forEach(({ fn }) => {
      fn.call(this, newData, oldData)
    })

    this[cache] = clone(newData)
  }
  [digest]() {}
}
