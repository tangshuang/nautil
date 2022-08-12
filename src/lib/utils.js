import {
  createProxy,
  isFunction,
  isObject,
  isEqual,
  isArray,
  isString,
  each,
  isInstanceOf,
  getConstructorOf,
  parse,
  mixin,
  isConstructor,
  isInheritedOf,
  define,
} from 'ts-fns'
import { isValidElement } from 'react'
import { Stream } from './core/stream.js'
import {
  Enum,
  List,
  Tupl,
  Any,
} from 'tyshemo'
import produce from 'immer'

/**
 * noop
 */
export function noop() {}

export const createProxyHandler = (data, receive) => {
  return {
    receive(keyPath, value, fn, args) {
      if (!fn) {
        receive(keyPath, value)
      }
      else {
        const arr = parse(data, keyPath)
        const next = produce(arr, (arr) => {
          arr[fn](...args)
        })
        receive(keyPath, next)
      }
    },
    writable() {
      return false
    },
    disable(_, value) {
      return isValidElement(value) || isRef(value)
    },
  }
}

/**
 * @param {object} data
 * @param {function} updator (data, key, value) => void
 * @param {boolean} [formalized] whether to generate formalized two-way-binding like [value, update]
 */
export function createTwoWayBinding(data, updator, formalized) {
  const traps = createProxyHandler(data, (keyPath, value) => {
    if (!formalized) {
      updator(value, keyPath, data)
    }
  })
  const proxy = createProxy(data, {
    ...traps,
    get(keyPath, value) {
      return formalized ? [value, value => updator(value, keyPath, data)] : value
    },
  })
  return proxy
}

export function ensureTwoWayBinding(origin, binding) {
  return new Proxy(origin, {
    get: (_, key) => {
      return [origin[key], value => binding[key] = value]
    },
    set: () => {
      return false
    },
    deleteProperty: () => {
      return false
    },
  })
}

export function createPlaceholderElement(placeholder) {
  if (isFunction(placeholder)) {
    return placeholder()
  }
  else {
    return placeholder || null
  }
}

/**
 * @param {*} objA
 * @param {*} objB
 * @param {function} isEqaul
 * @returns
 */
export function isShallowEqual(objA, objB, isEqaul) {
  if (objA === objB) {
    return true
  }

  if (typeof objA !== 'object' || typeof objB !== 'object') {
    return objA === objB
  }

  if (objA === null || objB === null) {
    return objA === objB
  }

  if (
    (isArray(objA) && !isArray(objB))
    || (isArray(objB) && !isArray(objA))
  ) {
    return false
  }

  const keysA = Object.keys(objA).sort()
  const keysB = Object.keys(objB).sort()

  // two empty object
  if (!keysA.length && !keysB.length) {
    return true
  }

  if (keysA.length !== keysB.length) {
    return false
  }

  for (let i = 0; i< keysA.length; i++) {
    const keyA = keysA[i]
    const keyB = keysB[i]

    if (keyA !== keyB) {
      return false
    }
    else if (isEqaul) {
      if (!isEqaul(objA[keyA], objB[keyB])) {
        return false
      }
    }
    else if (objA[keyA] !== objB[keyB]) {
      return false
    }
  }

  return true
}

export function isRef(obj) {
  return obj && isObject(obj) && isEqual(Object.keys(obj), ['current'])
}

export function camelCase(str) {
  const items = str.split(/\W|_/).filter(item => item)
  const text = items.reduce((text, curr) => text + curr.replace(curr[0], curr[0].toUpperCase()))
  return text
}

export class PrimitiveBase {
  constructor() {
    this.__init()
    this.init()
    this.__inited = true
    each(this, (value, key) => {
      if (isObject(value) && value.$$type === 'offer' && value.getter) {
        this[key] = value.getter()
      }
    })
  }

  __init() {}

  init() {}

  destroy() {}

  offer(getter) {
    if (!this.__inited) {
      // @ts-ignore
      return { $$type: 'offer', getter }
    }
    return getter()
  }

  destructor() {
    this.destroy()
    each(this, (value, key) => {
      if (isInstanceOf(value, Stream)) {
        value.complete()
        this[key] = null
      }
      // auto destroy refer objects, if it is a single instance, it will trigger its static destroy
      else if (value && isInstanceOf(value, PrimitiveBase)) {
        value.destructor()
        this[key] = null
      }
    })
  }

  new() {
    const Constructor = getConstructorOf(this)
    return new Constructor()
  }

  static implement(protos) {
    mixin(this, protos)
    return this
  }
}

export class SingleInstance extends PrimitiveBase {
  destructor() {
    // destroy single instance
    const Constructor = getConstructorOf(this)
    if (Constructor.__instance === this) {
      Constructor.destructor()
      this.isDied = Constructor.__instanced <= 0
    } else {
      this.isDied = true
    }

    this.destroy()

    if (this.isDied) {
      each(this, (value, key) => {
        if (isInstanceOf(value, Stream)) {
          value.complete()
          this[key] = null
        }
        // auto destroy refer objects, if it is a single instance, it will trigger its static destroy
        else if (value && isFunction(value.destructor) && !value.destructor.length) {
          value.destructor()
          this[key] = null
        }
      })
    }
  }

  static instance() {
    const Constructor = this

    // @ts-ignore
    Constructor.__instanced = Constructor.__instanced || 0
    // @ts-ignore
    // eslint-disable-next-line no-plusplus
    Constructor.__instanced++

    // @ts-ignore
    if (Constructor.__instance) {
      // @ts-ignore
      return Constructor.__instance
    }

    // @ts-ignore
    if (Constructor.__instanceDefer) {
      // @ts-ignore
      clearTimeout(Constructor.__instanceDefer)
    }
    const instance = new Constructor()
    // @ts-ignore
    Constructor.__instance = instance
    return instance
  }

  static destructor() {
    const Constructor = this

    Constructor.__instanced = Constructor.__instanced || 0
    if (Constructor.__instanced) {
      // eslint-disable-next-line no-plusplus
      Constructor.__instanced--
    }

    if (Constructor.__instance && Constructor.__instanced <= 0) {
      // delay delete, because we may create a instance in a short time
      Constructor.__instanceDefer = setTimeout(() => {
        Constructor.__instance = null
      }, 32)
    }
  }
}

export function parseUrl(url) {
  const [path, hash = ''] = url.split('#')
  const [pathname, search = ''] = path.split('?')
  return { path, pathname, search, hash }
}

export function parseSearch(search) {
  const params = {}
  const segs = search.replace(/^\?/, '').split('&')
  for (let i = 0, len = segs.length; i < len; i ++) {
    if (segs[i]) {
      let p = segs[i].split('=')
      params[p[0]] = p[1]
    }
  }
  return params
}

/**
 * resolve the url
 * @param {string} dir relative to this dir path
 * @param {string} to given target path
 * @returns url path begin with /
 */
export function resolveUrl(dir, to) {
  const roots = (dir || '').split('/').filter(item => item)
  const blocks = (to || '').split('/').filter(item => item)
  while (blocks.length) {
    const block = blocks[0]
    if (block === '..') {
      blocks.shift()
      roots.pop()
    }
    else if (block === '.') {
      blocks.shift()
    }
    else {
      break
    }
  }

  const url = `${roots.length ? '/' : ''}${roots.join('/')}${blocks.length ? '/' : ''}${blocks.join('/')}` || '/'
  return url
}

export function revokeUrl(abs, url) {
  const href = abs ? url.replace(abs, '') : url
  // /a/b -> a/b
  if (href && href[0] === '/') {
    return href.substring(1)
  }
  return href || ''
}

export function parseClassNames(classNames, cssRules) {
  let items = []

  if (isString(classNames)) {
    items = classNames.split(' ').filter(Boolean).map((className) => {
      if (cssRules[className]) {
        return cssRules[className]
      }

      const key = camelCase(className)
      if (cssRules[key]) {
        return cssRules[key]
      }

      // use self
      return className
    })
  }
  else if (isArray(classNames)) {
    items = classNames
      .map(item => isString(item) ? parseClassNames(item, cssRules) : item)
      .filter((item) => item && (isString(item) || typeof item === 'object'))
      .reduce((items, item) => {
        if (isArray(item)) {
          items.push(...item)
        }
        else {
          items.push(item)
        }
        return items
      }, [])
  }

  // return stylesheet with objects
  // only used when passed into `stylesheet` of internal components
  // i.e. <Section stylesheet={this.css('some-1 some-2')}></Section>
  if (items.some(item => isObject(item))) {
    return items.filter(item => isString(item) || isObject(item))
  }
  // return string class list
  // only used in DOM
  else {
    return items.join(' ')
  }
}

export function paramsToUrl(params) {
  return Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
}

const events = Symbol('events')
export class EventBase {
  constructor() {
    this[events] = []
  }
  on(name, fn) {
    this[events].push({ name, fn })
  }
  off(name, fn) {
    this[events] = this[events].filter(item => !(item.name === name && item.fn === fn))
  }
  emit(name, ...args) {
    this[events].forEach((item) => {
      if (item.name === name) {
        item.fn(...args)
      }
    })
  }
  hasEvent(name) {
    return this[events].some(item => item.name === name)
  }
}

export const Handling = new Enum([
  Function,
  new List([Function, Stream]),
  Stream,
])

export const Binding = new Tupl([Any, Function])

/**
 * which is always used in styles rules, such as `12px`, `15`, `center`...
 */
export const Unit = new Enum([
  String,
  Number,
])

export const StyleSheet = new Enum([
  String,
  Object,
  new List([String, Object]),
])


export function findInfoByMapping(data, mapping = {}) {
  const keys = Object.keys(mapping)
  const found = {}
  const notFound = []

  keys.forEach((key) => {
    const fromKey = mapping[key]
    let flag = false
    // 支持多个，从多个里面找一个
    if (isArray(fromKey)) {
      for (let i = 0, len = fromKey.length; i < len; i++) {
        const mayBe = fromKey[i]
        if (mayBe in data) {
          found[key] = data[mayBe]
          flag = true
          break
        }
      }
    } else if (isString(fromKey)) {
      found[key] = data[fromKey]
      flag = true
    }
    if (!flag) {
      notFound.push(key)
    }
  })

  return { found, notFound }
}

export function ofChainStatic(fromConstructor, topConstructor) {
  const properties = {}
  const push = (target) => {
    // if it is not a Constructor
    if (!isConstructor(target)) {
      // eslint-disable-next-line no-param-reassign
      target = getConstructorOf(target)
    }

    if (target === topConstructor) {
      return
    }

    each(
      target,
      (descriptor, key) => {
        if (!Object.getOwnPropertyDescriptor(properties, key)) {
          const prop = key.indexOf('$_') === 0 ? key.substring(2) : key
          if (prop.indexOf('_') === 0) {
            return
          }
          define(properties, prop, descriptor)
        }
      },
      true,
    )

    // to parent
    const Parent = getConstructorOf(target.prototype)
    if (isInheritedOf(Parent, topConstructor)) {
      push(target.prototype)
    }
  }
  push(fromConstructor)
  return properties
}
