import { isObject } from 'ts-fns'

export * from 'ts-fns'
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
export function groupArray(arr, count) {
  const results = []
  arr.forEach((item, i) => {
    const index = parseInt(i / count)
    results[index] = results[index] || []
    results[index].push(item)
  })
  return results
}
