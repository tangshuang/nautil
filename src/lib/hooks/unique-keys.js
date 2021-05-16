import { useMemo, useRef } from 'react'
import { createArray, createRandomString, isEqual } from 'ts-fns'

export function useUniqueKeys(items, shouldDeepEqual) {
  const lastest = useRef()
  const keys = useMemo(() => {
    // the first call
    if (!lastest.current) {
      const arr = createArray('', items.length)
      const keys = arr.map(() => createRandomString(8))
      lastest.current = { items, keys }
      return keys
    }
    // call again
    else {
      const { items: prevItems, keys: prevKeys } = lastest.current
      const nextKeys = []

      items.forEach((item, i) => {
        const index = prevItems.findIndex(one => shouldDeepEqual ? isEqual(item, one) : item === one)
        if (index > -1) {
          nextKeys[i] = prevKeys[index]
        }
      })

      items.forEach((_, i) => {
        if (!nextKeys[i]) {
          const prevKey = prevKeys[i]
          if (!prevKey) {
            nextKeys[i] = createRandomString(8)
          }
          else if (nextKeys.includes(prevKey)) {
            nextKeys[i] = createRandomString(8)
          }
          else {
            nextKeys[i] = prevKey
          }
        }
      })

      lastest.current = { items, keys: nextKeys }
      return nextKeys
    }
  }, [items, shouldDeepEqual])

  return keys
}
export default useUniqueKeys
