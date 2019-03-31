import { unionArray } from './array.js'

/** */
export function isNumber(value) {
  return typeof value === 'number' && !isNaN(value) && Number.isFinite(value)
}

/** */
export function isBoolean(value) {
  return value === true || value === false
}

/** */
export function isString(value) {
  return typeof value === 'string'
}

/** */
export function isFunction(value) {
  return typeof value === 'function'
    && (value + '') !== `function ${value.name}() { [native code] }`
    && (value + '').indexOf('class ') !== 0
    && (value + '').indexOf('_classCallCheck(this,') === -1 // for babel transfered class
}

/** */
export function isSymbol(value) {
  return typeof value === 'symbol'
}

/** */
export function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object
}

/** */
export function isArray(value) {
  return Array.isArray(value)
}

/** */
export function inArray(value, arr) {
  return arr.indexOf(value) > -1
}

/** */
export function inObject(key, obj) {
  return inArray(key, Object.keys(obj))
}

/** */
export function isNaN(value) {
  return typeof value === 'number' && Number.isNaN(value)
}

/** */
export function isUndefined(value) {
  return typeof value === 'undefined'
}

/** */
export function isNull(value) {
  return value === null
}

/** */
export function isEmpty(value) {
  if (isNull(value) || isUndefined(value) || value === '' || isNaN(value)) {
		return true
	}
	else if (isArray(value)) {
		return value.length === 0
	}
	else if (isObject(value)) {
		return Object.keys(value).length === 0
	}
	return false
}

/** */
export function isConstructor(f) {
  let instance = null
  try {
    instance = new f()
  }
  catch (e) {
    if (e.message.indexOf('is not a constructor') > -1) {
      instance = null
      return false
    }
  }
  instance = null
  return true
}

/**
 * 判断ins是否是cons的实例
 * @param {*} ins
 * @param {*} cons
 * @param {*} strict ins是否是cons的直接实例
 */
export function isInstanceOf(ins, cons, strict) {
  return strict ? ins.constructor === cons : ins instanceof cons
}

/** */
export function isEqual(val1, val2) {
  const equal = (obj1, obj2) => {
    let keys1 = Object.keys(obj1)
    let keys2 = Object.keys(obj2)
    let keys = unionArray(keys1, keys2)

    for (let i = 0, len = keys.length; i < len; i ++) {
      let key = keys[i]

      if (!inArray(key, keys1)) {
        return false
      }
      if (!inArray(key, keys2)) {
        return false
      }

      let value1 = obj1[key]
      let value2 = obj2[key]
      if (!isEqual(value1, value2)) {
        return false
      }
    }

    return true
  }

  if (isObject(val1) && isObject(val2)) {
    return equal(val1, val2)
  }
  else if (isArray(val1) && isArray(val2)) {
    return equal(val1, val2)
  }
  else {
    return val1 === val2
  }
}
