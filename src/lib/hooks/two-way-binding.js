import { Ty } from 'tyshemo'
import { Binding } from '../types.js'
import { noop } from '../utils.js'
import { useState, useCallback } from 'react'

/**
 * when you are not sure whether a var is a binding, use this function to deconstruct.
 * @param {*} value
 */
export function useTwoWayBinding(value) {
  const [_, setState] = useState()

  const binding = [].concat(value)
  if (process.env.NODE_ENV !== 'production') {
    Ty.expect(binding).to.be(Binding)
  }

  const [v, set = noop] = binding
  const update = useCallback((...args) => {
    set(...args)
    setState({})
  }, [set])

  return [v, update]
}
export default useTwoWayBinding
