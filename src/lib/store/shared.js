import { useState, useEffect } from 'react'
import { Component } from '../component.js'

export function applyStore(store) {
  function useStore() {
    const [, update] = useState()
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
        store.subscribe(this.update)
      }
      onUnmount() {
        store.unsubscribe(this.update)
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
