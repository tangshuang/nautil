import { isObject } from 'ts-fns'

export * from 'ts-fns'
export function noop() {}
export function define(obj, prop, value) {
  Object.defineProperty(obj, prop, { value })
}
export function isObjectsAbsolutelyEqual(obj1, obj2) {
  if (!isObject(obj1) || !isObject(obj2)) {
    return obj1 === obj2
  }
  if (Object.keys(obj1).length == 0 && Object.keys(obj2).length === 0) {
    return true
  }
  return obj1 === obj2
}
