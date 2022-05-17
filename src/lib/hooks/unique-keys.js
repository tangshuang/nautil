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

      items.forEach((item, index) => {
        for (let i = 0, len = prevItems.length; i < len; i ++) {
          const one = prevItems[i]
          const isEqualed = shouldDeepEqual ? isEqual(item, one) : item === one
          if (!isEqualed) {
            continue
          }

          const prevKey = prevKeys[i]
          // this is the key line
          // there may be two same value in the list, for example: [1, 0, 1, 1] -> [1, 1, 0, 1]
          // TODO: O(n^3) -> O(n^2)
          if (nextKeys.includes(prevKey)) {
            continue
          }

          nextKeys[index] = prevKey
          break
        }

        if (!nextKeys[index]) {
          nextKeys[index] = createRandomString(8)
        }
      })

      lastest.current = { items, keys: nextKeys }
      return nextKeys
    }
  }, [items, shouldDeepEqual, items.length]) // items may keep the same array but invoke push/pop, so we use length to determine

  return keys
}
