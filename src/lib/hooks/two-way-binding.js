import { Ty } from 'tyshemo'
import { Binding } from '../types.js'
import { createTwoWayBinding, ensureTwoWayBinding } from '../utils.js'
import { useMemo, useState } from 'react'
import { each, isObject } from 'ts-fns'
import produce from 'immer'
import { useShallowLatest } from './shallow-latest.js'
import { useForceUpdate } from './force-update.js'

/**
 * @param {object} data
 * @param {function} updator (data, key, value) => boolean, true to forceUpdate, false without effect
 * @param {boolean} [formalized] whether to generate formalized two-way-binding like [value, update]
 */
export function useTwoWayBinding(data, updator, formalized) {
  const forceUpdate = useForceUpdate()
  const obj = useShallowLatest(data)
  const binding = useMemo(() => createTwoWayBinding(data, (data, keyPath, value) => {
    if (updator(data, keyPath, value)) {
      forceUpdate()
    }
  }, formalized), [obj])
  return binding
}

/**
 * @param {object} props
 * @param {boolean} [formalized] whether to generate formalized two-way-binding like [value, update]
 * @return {tuple} [attrs, $attrs]
 */
export function useTwoWayBindingAttrs(props, formalized) {
  const latest = useShallowLatest(props)

  const [attrs, bindKeys] = useMemo(() => {
    const bindTypes = {}
    const bindAttrs = {}
    const bindKeys = []

    const attrs = {}

    each(props, (value, key) => {
      if (/^\$[a-zA-Z]/.test(key)) {
        const attr = key.substr(1)
        attrs[attr] = value[0]

        if (process.env.NODE_ENV !== 'production') {
          bindTypes[key] = Binding
          bindAttrs[key] = value
        }

        bindKeys.push(attr)
      }
      else if (!/^on[A-Z]/.test(key)) {
        attrs[key] = value
      }
    })

    if (process.env.NODE_ENV !== 'production') {
      Ty.expect(bindAttrs).to.be(bindTypes)
    }

    return [attrs, bindKeys]
  }, [latest])

  const $attrs = useTwoWayBinding(attrs, (_, keyPath, value) => {
    const [root] = keyPath
    // only react for those props which begin with $
    if (bindKeys.includes(root)) {
      const update = props[`$${root}`][1]
      update(value)
      return true
    }
    return false
  })
  return formalized ? ensureTwoWayBinding(attrs, $attrs) : [attrs, $attrs]
}

/**
 * @param {object} initState
 * @param {boolean} [formalized] whether to generate formalized two-way-binding like [value, update]
 * @returns [state, $state]
 */
export function useTwoWayBindingState(initState, formalized) {
  const obj = isObject(initState) ? initState : { value: initState }
  const [state, setState] = useState(obj)
  const $state = useMemo(() => new Proxy({}, {
    set: (_, key, value) => {
      const next = produce(state, (state) => {
        assign(state, key, value)
      })
      setState(next)
      return true
    },
    deleteProperty: (_, key) => {
      const next = { ...state }
      delete next[key]
      setState(next)
      return true
    },
  }), [state])
  return formalized ? ensureTwoWayBinding(state, $state) : [state, $state]
}
