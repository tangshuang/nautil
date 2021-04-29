import { Component } from '../component.js'
import { useStore as originUseStore } from './consumer.jsx'

export function applyStore(store) {
  const useStore = () => originUseStore(store)
  const connect = mapToProps => C => {
    return class ConnectedComponent extends Component {
      onInit() {
        store.subscribe(this.forceUpdate)
      }
      onUnmount() {
        store.unsubscribe(this.forceUpdate)
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
