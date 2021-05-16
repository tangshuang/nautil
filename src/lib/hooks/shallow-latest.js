import { useRef } from 'react'
import { isShallowEqual } from '../utils.js'

/**
 * @param {*} obj
 * @returns the latest shallow equal object
 */
export function useShallowLatest(obj) {
  const latest = useRef(obj)
  if (!isShallowEqual(latest.current, obj)) {
    latest.current = obj
  }
  return latest.current
}