import { Ty } from 'tyshemo'
import { Binding } from '../types.js'
import { noop } from '../utils.js'

/**
 * when you are not sure whether a var is a binding, use this function to deconstruct.
 * @param {*} value
 */
export function useTwoWayBinding(value, update) {
  if (update) {
    return [value, update]
  }

  const binding = [].concat(value)
  if (process.env.NODE_ENV !== 'production') {
    Ty.expect(binding).to.be(Binding)
  }

  const [v, set = noop] = binding
  return [v, set]
}
