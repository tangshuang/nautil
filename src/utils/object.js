import { isObject, isArray } from './is.js'
import { makeKeyChainByPath } from './key-path.js'
import { getStringHash } from './string.js'

/**
 * 根据keyPath读取对象属性值
 * @param {*} obj
 * @param {*} path
 * @example
 * parse({ child: [ { body: { head: true } } ] }, 'child[0].body.head') => true
 */
export function parse(obj, path) {
  let chain = makeKeyChainByPath(path)

  if (!chain.length) {
    return obj
  }

  let target = obj
  for (let i = 0, len = chain.length; i < len; i ++) {
    let key = chain[i]
    if (target[key] === undefined) {
      return undefined
    }
    target = target[key]
  }
  return target
}

/**
 * 根据keyPath设置对象的属性值
 * @param {*} obj
 * @param {*} path
 * @param {*} value
 * @example
 * assign({}, 'body.head', true) => { body: { head: true } }
 */
export function assign(obj, path, value) {
  let chain = makeKeyChainByPath(path)

  if (!chain.length) {
    return obj
  }

  let key = chain.pop()

  if (!chain.length) {
    obj[key] = value
    return obj
  }

  let target = obj

  for (let i = 0, len = chain.length; i < len; i ++) {
    let key = chain[i]
    let next = chain[i + 1] || key
    if (/^[0-9]+$/.test(next) && !Array.isArray(target[key])) {
      target[key] = []
    }
    else if (typeof target[key] !== 'object') {
      target[key] = {}
    }
    target = target[key]
  }

  target[key] = value

  return obj
}

/**
 * 深克隆一个对象
 * @param {*} obj
 */
export function clone(obj) {
  let parents = []
  let clone = function(origin) {
    if (!isObject(origin) && !isArray(origin)) {
      return origin
    }

    let result = isArray(origin) ? [] : {}
    let keys = Object.keys(origin)

    parents.push({ origin, result })

    for (let i = 0, len = keys.length; i < len; i ++) {
      let key = keys[i]
      let value = origin[key]
      let referer = parents.find(item => item.origin === value)

      if (referer) {
        result[key] = referer.result
      }
      else {
        result[key] = clone(value)
      }
    }

    return result
  }

  let result = clone(obj)
  parents = null
  return result
}

/**
 * 浅遍历对象
 * @param {*} data
 * @param {*} fn
 */
export function each(data, fn) {
  let keys = Object.keys(data)
  keys.forEach(key => fn(data[key], key, data))
}

/**
 * 深遍历对象
 * @param {*} data
 * @param {*} fn
 */
export function traverse(data, fn) {
  let traverse = (data, path = '') => {
    each(data, (value, key) => {
      path = path ? path + '.' + key : key
      if (isObject(value) || isArray(value)) {
        fn(value, key, data, path, true)
        traverse(value, path)
      }
      else {
        fn(value, key, data, path, false)
      }
    })
  }
  traverse(data)
}

/**
 * 获取一个复杂结构对象的字面量值，它会同时读取原型链上的可枚举值
 * @param {*} obj
 */
export function valueOf(obj) {
  const isObj = obj => isObject(obj) || isArray(obj)
  if (isObj(obj)) {
    let result = isArray(obj) ? [] : {}
    each(obj, (value, key) => {
      if (isObj(value)) {
        result[key] = valueOf(value)
      }
      else {
        result[key] = value
      }
    })
    return result
  }
  else {
    return obj
  }
}

/**
 * 重新设置对象的原型为proto
 * @param {*} obj
 * @param {*} proto
 */
export function inheritOf(obj, proto) {
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(obj, proto)
  }
  else {
    obj.__proto__ = proto
  }
}

/**
 * 使用define语法设置对象属性值
 * @param {*} obj
 * @param {*} key
 * @param {*} value
 * @param {*} options
 */
export function defineProperty(obj, key, value, options = {}) {
  Object.defineProperty(obj, key, { ...options, value })
}

/**
 * 使用define语法批量设置对象属性
 * @param {*} obj
 * @param {*} values
 * @param {*} options
 */
export function defineProperties(obj, values, options = {}) {
  let keys = Object.keys(values)
  let props = {}
  keys.forEach((key) => {
    let value = values[key]
    props[key] = { ...options, value }
  })
  Object.defineProperties(obj, props)
}

/**
 * 使用define语法设置对象属性getter
 * @param {*} obj
 * @param {*} key
 * @param {*} get
 * @param {*} options
 */
export function defineGetter(obj, key, get, options = {}) {
  Object.defineProperty(obj, key, { ...options, get })
}

/**
 * 使用define语法批量设置getter
 * @param {*} obj
 * @param {*} fns
 * @param {*} options
 */
export function defineGetters(obj, fns, options = {}) {
  let keys = Object.keys(fns)
  let props = {}
  keys.forEach((key) => {
    let get = fns[key]
    props[key] = { ...options, get }
  })
  Object.defineProperties(obj, props)
}

/**
 * 将对象的key重新排序之后返回
 * @param {*} obj
 */
export function sortObject(obj) {
  let keys = Object.keys(obj)
  keys.sort()
  let o = {}
  keys.forEach((key) => {
    let value = obj[key]
    if (isObject(value)) {
      value = sort(value)
    }
    o[key] = value
  })
  return o
}

/**
 * 深度合并两个对象
 * @param {*} obj1
 * @param {*} obj2
 * @param {*} contactArray 当对应位置都是数组时，是否直接将两个数组连接即可
 */
export function merge(obj1, obj2, contactArray = true) {
  obj1 = clone(obj1)

  if (!isArray(obj2) || !isObject(obj2)) {
    return isArray(obj1) || isObject(obj1) ? obj1 : null
  }

  obj2 = clone(obj2)

  if (!isArray(obj1) || !isObject(obj1)) {
    return isArray(obj2) || isObject(obj2) ? obj2 : null
  }

  const exists = []
  const merge = (obj1, obj2) => {
    if (isArray(obj1)) {
      if (isArray(obj2) && contactArray) {
        return obj1.contact(obj2)
      }
    }

    let result = obj1
    let keys = Object.keys(obj2)
    keys.forEach((key) => {
      let oldValue = obj1[key]
      let newValue = obj2[key]

      if (isObject(newValue) || isArray(newValue)) {
        let index = exists.indexOf(newValue)
        if (index === -1) {
          exists.push(newValue)
        }
        else if (!isArray(oldValue) && !isObject(oldValue)) {
          result[key] = newValue
          return
        }
      }

      if (isObject(newValue) || isArray(newValue)) {
        if (isObject(oldValue) || isArray(oldValue)) {
          result[key] = merge(oldValue, newValue, contactArray)
        }
        else {
          result[key] = newValue
        }
      }
      else {
        result[key] = newValue
      }
    })
    return result
  }

  return merge(obj1, obj2)
}

/**
 * 将一个对象/数组字符串化，如果内部存在自引用的，会用#标记
 * @param {*} obj
 */
export function stringify(obj) {
  const exists = [obj]
  const used = []
  const stringify = (obj) => {
    if (isArray(obj)) {
      let items = obj.map((item) => {
        if (item && typeof item === 'object') {
          return stringify(item)
        }
        else {
          return JSON.stringify(item)
        }
      })
      let str = '[' + items.join(',') + ']'
      return str
    }

    let str = '{'
    let keys = Object.keys(obj)
    let total = keys.length

    keys.sort()
    keys.forEach((key, i) => {
      let value = obj[key]
      str += key + ':'

      if (value && typeof value === 'object') {
        let index = exists.indexOf(value)
        if (index > -1) {
          str += '#' + index
          used.push(index)
        }
        else {
          exists.push(value)
          let num = exists.length - 1
          str += '#' + num + stringify(value)
        }
      }
      else {
        str += JSON.stringify(value)
      }

      if (i < total - 1) {
        str += ','
      }
    })
    str += '}'
    return str
  }

  let str = stringify(obj)

  exists.forEach((item, i) => {
    if (!used.includes(i)) {
      str = str.replace(new RegExp(`:#${i}`, 'g'), ':')
    }
  })

  if (used.includes(0)) {
    str = '#0' + str
  }

  return str
}

/**
 * 获取一个对象的hash
 * @param {*} obj
 */
export function getObjectHash(obj) {
  if (typeof obj !== 'object') {
    return
  }

  let str = stringify(obj)
  let hash = getStringHash(str)
  return hash
}
