import { isRef } from '../utils.js'
import { isValidElement, useMemo } from 'react'
import { each, map, createProxy } from 'ts-fns'
import produce from 'immer'

/**
 * when you are not sure whether a var is a binding, use this function to deconstruct.
 * @param {*} value
 */
export function useTwoWayBinding(attrs) {
  const finalAttrs = {}
  const deps = []

  each(attrs, (data, key) => {
    if (/^\$[a-zA-Z]/.test(key)) {
      const attr = key.substr(1)
      finalAttrs[attr] = data[0]
      deps.push(attr, data[0])
    }
    else if (!/^on[A-Z]/.test(key)) {
      finalAttrs[key] = data
      deps.push(key, data)
    }
  })

  return useMemo(() => {
    const originalAttrs =  map(finalAttrs, (value) => {
      return value && typeof value === 'object' && value[Symbol('ORIGIN')] ? value[Symbol('ORIGIN')] : value
    })

    const bindingAttrs = createProxy(finalAttrs, {
      writable(keyPath, value) {
        const chain = isArray(keyPath) ? [...keyPath] : makeKeyChain(keyPath)
        const root = chain.shift()
        const bindKey = '$' + root
        const bindData = attrs[bindKey]
        if (bindData) {
          const [current, update] = bindData
          if (chain.length) {
            const next = produce(current, data => {
              assign(data, chain, value)
            })
            update(next, current)
          }
          else {
            update(value, current)
          }
        }
        return false
      },
      disable(_, value) {
        return isValidElement(value) || isRef(value)
      },
    })

    return [originalAttrs, bindingAttrs]
  }, deps) // only shallow changes will trigger recalculate
}
export default useTwoWayBinding
