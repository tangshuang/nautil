import {
  isObject,
  isArray,
  isFunction,
  createProxy,
  assign,
  isBoolean,
  map,
} from 'ts-fns'
import { Children } from 'react'
import { Subject } from 'rxjs'

export * from 'ts-fns'
export {
  Children,
  cloneElement,
  createContext,
  createElement,
  createFactory,
  createRef,
  isValidElement as isElement,
} from 'react'

/**
 * noop
 */
export function noop() {}

/**
 * objects absolute equal, use === to detect
 * @param {*} obj1
 * @param {*} obj2
 */
export function isObjectsAbsolutelyEqual(obj1, obj2) {
  if (!isObject(obj1) || !isObject(obj2)) {
    return obj1 === obj2
  }
  if (Object.keys(obj1).length == 0 && Object.keys(obj2).length === 0) {
    return true
  }
  return obj1 === obj2
}

export function filterChildren(children, iterator) {
  if (!iterator) {
    iterator = item => item !== null && item !== undefined && !isBoolean(item) && item
  }
  const output = Children.toArray(children).filter(iterator)
  return output
}

export function mapChildren(children, iterator) {
  children = Children.map(children, iterator)
  return children
}

/**
 * use the passed handler like onClick to create a stream
 * @param {*} param
 */
export function createHandledStream(param) {
  var subject = new Subject()

  const args = isArray(param) ? [...param] : [param]
  const subscribe = args.pop()

  if (args.length) {
    subject = subject.pipe(...args)
  }

  if (isFunction(subscribe)) {
    subject.subscribe(subscribe)
  }

  return subject
}

/**
 * create a two-way-bind value:
 * pass:
 *   $value={[state.value, value => state.value = value]}
 * now:
 *   const $state = createTwoWayBinding(state)
 *   $value={$state.value}
 * @param {*} data
 * @param {*} reflect
 */
export function createTwoWayBinding(data, reflect) {
  const createReflect = (data, keyPath) => {
    return (v) => {
      // use passed reflect
      if (isFunction(reflect)) {
        reflect(data, keyPath, v)
      }
      // update data directly
      else {
        assign(data, keyPath, v)
      }
    }
  }
  const proxy = createProxy(data, {
    get({ keyPath }) {
      const reflect = createReflect(data, keyPath)
      return [value, reflect]
    },
    set({ keyPath }) {
      const reflect = createReflect(data, keyPath)
      reflect(value)
    },
    del({ keyPath }) {
      // use passed reflect
      if (isFunction(reflect)) {
        reflect(data, keyPath)
      }
      // update data directly
      else {
        remove(data, keyPath)
      }
    },
  })
  return proxy
}

export function createPlaceholderComponent(placeholder) {
  if (isFunction(placeholder)) {
    return placeholder()
  }
  else {
    return placeholder || null
  }
}

export function attachPrototype(Target, protos) {
  Object.assign(Target.prototype, protos)
  return Target
}

export function attachPrototypeEntry(Target, props) {
  Object.assign(Target.prototype, map(props, (value, key) => {
    const original = Target.prototype[key]
    return function(...args) {
      // results should be an array
      const results = value.apply(this, args)
      const output = isFunction(original) ? original.apply(this, results) : results
      return output
    }
  }))
  return Target
}

export function attachPrototypeOutput(Target, props) {
  Object.assign(Target.prototype, map(props, (value, key) => {
    const original = Target.prototype[key]
    return function(...args) {
      const results = original.apply(this, args)
      const output = value.apply(this, results)
      return output
    }
  }))
  return Target
}

export function attachStatic(Target, props) {
  Object.assign(Target, props)
  return Target
}

export function attachShadowClass(TargetClass, ShadowClass) {
  Object.setPrototypeOf(TargetClass, ShadowClass)
  Object.setPrototypeOf(TargetClass.prototype, ShadowClass.prototype)
  return TargetClass
}
