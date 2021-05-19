import { useRef } from 'react'
import { isShallowEqual } from '../utils.js'

/**
 * @param {*} obj
 * @returns the latest shallow equal object
 */
export function useShallowLatest(obj) {
  const used = useRef(false)
  const latest = useRef(obj)

  if (used.current && !isShallowEqual(latest.current, obj)) {
    latest.current = obj
  }

  if (!used.current) {
    used.current = true
  }

  return latest.current
}
