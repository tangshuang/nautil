import { useState, useEffect } from 'react'
import { Store } from './store.js'

export function applyStore(initState) {
  const store = new Store(initState)
  return function useStore() {
    const [_, update] = useState()
    useEffect(() => {
      const forceUpdate = () => {
        update({})
      }
      store.subscribe(forceUpdate)
      return () => store.unsubscribe(forceUpdate)
    }, [])

    return store
  }
}
