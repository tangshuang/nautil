import { Ty } from 'tyshemo'
import { Binding } from '../types.js'
import { isRef } from '../utils.js'
import { isValidElement, useMemo } from 'react'
import { each, createProxy } from 'ts-fns'
import produce from 'immer'
import { useShallowLatest } from './shallow-latest.js'

/**
 * when you are not sure whether a var is a binding, use this function to deconstruct.
 * @param {*} value
 */
export function useTwoWayBinding(attrs) {
  const bindTypes = {}
  const bindAttrs = {}

  const finalAttrs = {}
  const deps = []

  each(attrs, (data, key) => {
    if (/^\$[a-zA-Z]/.test(key)) {
      const attr = key.substr(1)
      finalAttrs[attr] = data[0]
      deps.push(attr, data[0])

      if (process.env.NODE_ENV !== 'production') {
        bindTypes[key] = Binding
        bindAttrs[key] = data
      }
    }
    else if (!/^on[A-Z]/.test(key)) {
      finalAttrs[key] = data
      deps.push(key, data)
    }
  })

  const latest = useShallowLatest(deps)

  const res = useMemo(() => {
    if (process.env.NODE_ENV !== 'production') {
      Ty.expect(bindAttrs).to.be(bindTypes)
    }

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

    return [finalAttrs, bindingAttrs]
  }, [latest]) // only shallow changes will trigger recalculate

  return res
}
export default useTwoWayBinding
