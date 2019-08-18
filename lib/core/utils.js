import { isObject, isArray, isString, isFunction } from 'ts-fns'
import React from 'react'
import { Subject } from 'rxjs'

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

export function cloneElement(...args) {
  return React.cloneElement(...args)
}

export function filterChildren(children, iterator) {
  if (!iterator) {
    iterator = item => item !== null && item !== undefined
  }
  children = React.Children.toArray(children).filter(iterator)
  return children
}

export function mapChildren(children, iterator) {
  children = React.Children.map(children, iterator)
  return children
}

export function createContext(value) {
  return React.createContext(value)
}

export function createClassName(obj) {
  if (isString(obj)) {
    return obj
  }

  if (isArray(obj)) {
    return obj.map(item => createClassName(item)).join(' ')
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
