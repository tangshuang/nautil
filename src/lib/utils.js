import { assign, createProxy, isFunction, isObject, isEqual } from 'ts-fns'
import produce from 'immer'

/**
 * noop
 */
export function noop() {}

/**
 * create a two-way-bind value:
 * pass:
 *   <Some $value={[state.value, value => state.value = value]} />
 * now:
 *   const $state = createTwoWayBinding(state)
 *   <Some $value={$state.value} />
 * @param {*} data
 * @param {*} update
 */
export function createTwoWayBinding(data, update) {
  const reactive = (data, keyPath, value) => {
    // use passed update
    if (isFunction(update)) {
      const next = produce(data, data => {
        assign(data, keyPath, value)
      })
      update(next, keyPath, value)
    }
    // update data directly
    else {
      assign(data, keyPath, value)
    }
  }
  const proxy = createProxy(data, {
    get(keyPath, value) {
      return [value, (value) => reactive(data, keyPath, value)]
    },
    set(keyPath, value) {
      reactive(data, keyPath, value)
    },
    del(keyPath) {
      // use passed update
      if (isFunction(update)) {
        const next = produce(data, data => {
          remove(data, keyPath)
        })
        update(next, keyPath)
      }
      // update data directly
      else {
        remove(data, keyPath)
      }
    },
  })
  return proxy
}

export function createPlaceholderElement(placeholder) {
  if (isFunction(placeholder)) {
    return placeholder()
  }
  else {
    return placeholder || null
  }
}

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
