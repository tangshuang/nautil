import Objext from 'objext'
import Rx from 'rxjs'

const model = Symbol('model')
const update = Symbol('update')
const reactiveKeys = Symbol('reactiveKeys') // 可响应的key
const inheritKeys = Symbol('inheritKeys') // 继承自父级作用域的key，在update时反写给父级作用域
const admitKeys = Symbol('admitKeys') // 传递给子作用域的key，当子作用域反写时仅接受这些key
const inited = Symbol('inited')
const propagate = Symbol('propagate')
const broadcast = Symbol('broadcast')

export class Model {

  constructor() {
    const { data, state, form, computed } = this.constructor
    const origin = {}

    this[reactiveKeys] = []
    this[inheritKeys] = []
    this[admitKeys] = []
    this[inited] = false

    if (form) {
      Object.keys(form).forEach(key => this[reactiveKeys].push(key))
    }
    if (data) {
      Object.keys(form).forEach(key => this[reactiveKeys].push(key))
    }
    if (state) {
      Object.keys(form).forEach(key => this[reactiveKeys].push(key))
    }
    if (computed) {}

    this[model] = new Objext(origin)
  }

  init$(fn) {
    if (this[inited]) {
      return null
    }

    const stream = Rx.from(origin)
    stream = fn(stream) || stream
    stream.subscribe(data => this[update](data))

    this[inited] = true
  }

  inherit$(fn) {
    if (!this[inited]) {
      return null
    }
  }

  fork$(fn) {
    if (!this[inited]) {
      return null
    }

    const stream = Rx.from(null)
    stream = fn(stream) || stream
    stream.subscribe(data => this[update](data))
    return stream
  }

  [update](data) {
    let reactiveData = {}
    let inheritData = {}
    let admitData = {}
    let keys = Object.keys(data)

    keys.forEach((key) => {
      let value = data[key]
      // 只更新可以被更新的
      if (this[reactiveKeys].includes(key)) {
        reactiveData[key] = value
      }
      // 往父级作用域反写
      if (this[inheritKeys].includes(key)) {
        inheritData[key] = value
      }
      // 往子作用域广播新值
      if (this[admitKeys].includes(key)) {
        admitData[key] = value
      }
    })

    this[model].$update(reactiveData)
    this[propagate](inheritData)
    this[broadcast](admitData)
  }

  [propagate](data) {}
  [broadcast](data) {}
}
