import { useMemo } from 'react'
import { createArray, createRandomString } from 'ts-fns'

export function useUniqueKeys(count) {
  const keys = useMemo(() => {
    const arr = createArray('', count)
    const keys = arr.map(() => createRandomString(8))
    return keys
  }, [count])

  return keys
}
export default useUniqueKeys
