import { useMemo, useRef } from 'react'
import { createArray, createRandomString, isEqual } from 'ts-fns'

export function useUniqueKeys(items, useEqual) {
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
      const nextItems = []
      const nextKeys = []

      items.forEach((item) => {
        const index = prevItems.findIndex(one => useEqual ? isEqual(item, one) : item === one)
        if (index === -1) {
          const key = createRandomString(8)
          nextKeys.push(key)
          nextItems.push(item)
        }
        else {
          const key = prevKeys[index]
          nextKeys.push(key)
          nextItems.push(item)
        }
      })

      lastest.current = { items: nextItems, keys: nextKeys }
      return nextKeys
    }
  }, [items, useEqual])

  return keys
}
export default useUniqueKeys
