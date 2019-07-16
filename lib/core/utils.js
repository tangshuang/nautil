import { isObject, each, inObject } from 'ts-fns'
import React from 'react'

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

// export function injectIntoChldren(children, injection) {
//   return React.Children.map(children, (child) => {
//     const Constructor = child.type

//     if (!Constructor) {
//       return child
//     }

//     const { injectProps } = Constructor

//     const attrs = {}
//     if (injectProps) {
//       each(injectProps, (value, key) => {
//         if (!value) {
//           return
//         }
//         if (inObject(key, injection)) {
//           attrs[key] = injection[key]
//         }
//       })
//     }

//     const { children, ...props } = child.props
//     const subChildren = inject(children, injection)
//     return React.cloneElement(child, { ...attrs, ...props }, subChildren)
//   })
// }

export function createClassName(obj) {
  const className = ''
  each(obj, (value, key) => {
    if (value) {
      className += ' ' + key
    }
  })
  return className
}

export function createContext(value) {
  const context = React.createContext(value)
  const { Provider, Consumer } = context
  return {
    context,
    Provider,
    Consumer,
    value,
  }
}

export function cloneElement(...args) {
  return React.cloneElement(...args)
}

export function cloneChildren(children) {
  return React.Children.map(children, (child) => cloneElement(child))
}
