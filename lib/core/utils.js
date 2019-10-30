import { isObject, isArray, isString, isFunction, createProxy, assign, isBoolean } from 'ts-fns'
import { Children } from 'react'
import { Subject } from 'rxjs'

export * from 'ts-fns'
export {
  cloneElement,
  createContext,
  createElement,
  createFactory,
  createRef,
  userCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'

export function noop() {}

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

export function createClassName(obj) {
  if (isString(obj)) {
    return obj
  }

  if (isObject(obj)) {
    const className = ''
    each(obj, (value, key) => {
      if (value) {
        className += ' ' + key
      }
    })
    return className
  }

  if (isArray(obj)) {
    return obj.map(item => createClassName(item)).join(' ')
  }

  return ''
}

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

export function attachShadowClass(TargetClass, SourceClass) {
  Object.setPrototypeOf(TargetClass, SourceClass)
  Object.setPrototypeOf(TargetClass.prototype, SourceClass.prototype)
  return TargetClass
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
  const createReflect = (data, keyPath, target, key) => {
    return  v => {
      // use passed reflect
      if (isFunction(reflect)) {
        reflect([data, keyPath, v], [target, key, v])
      }
      // update data directly
      else {
        assign(data, keyPath, v)
      }
    }
  }
  const proxy = createProxy(data, {
    get([data, keyPath, value], [target, key]) {
      const reflect = createReflect(data, keyPath, target, key)
      return [value, reflect]
    },
    set([data, keyPath, value], [target, key]) {
      const reflect = createReflect(data, keyPath, target, key)
      reflect(value)
    },
    del([data, keyPath], [target, key]) {
      // use passed reflect
      if (isFunction(reflect)) {
        reflect([data, keyPath], [target, key])
      }
      // update data directly
      else {
        remove(data, keyPath)
      }
    },
  })
  return proxy
}

/**
 * when you are not sure whether a var is a binding, use this function to deconstruct.
 * @param {*} value
 */
export function useTwoWayBinding(value) {
  const binding = [].concat(value)
  const [value, set = noop] = binding
  return [value, set]
}

export function createPlaceholderComponent(placeholder) {
  if (isFunction(placeholder)) {
    return placeholder()
  }
  else {
    return placeholder || null
  }
}
