import {
  Ty,
  Binding,
} from '../types'
import {
  noop,
} from '../utils.js'

export {
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

/**
 * when you are not sure whether a var is a binding, use this function to deconstruct.
 * @param {*} value
 */
export function useTwoWayBinding(value, reflect) {
  if (reflect) {
    return [value, reflect]
  }

  const binding = [].concat(value)
  if (process.env.NODE_ENV !== 'production') {
    Ty.expect(binding).to.be(Binding)
  }

  const [v, set = noop] = binding
  return [v, set]
}
