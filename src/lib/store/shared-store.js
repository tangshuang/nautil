import { useState, useEffect } from 'react'
import { Component } from '../component.js'

export function applyStore(store) {
  function useStore() {
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
  const connect = mapToProps => C => {
    return class ConnectedComponent extends Component {
      onInit() {
        store.watch('*', this.update, true)
      }
      onUnmount() {
        store.unwatch('*', this.update)
      }
      render() {
        const data = mapToProps(store)
        const props = { ...this.props, ...data }
        return <C {...props} />
      }
    }
  }
  return { useStore, connect }
}
