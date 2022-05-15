import { Component } from '../core/component.js'
import { useLocalStore, Consumer } from './context.js'
import { isInstanceOf } from 'ts-fns'
import { Store } from './store.js'

export function applyStore(store) {
  const useStore = (watch) => useLocalStore(store, watch)
  const connect = (mapStoreToProps, watch) => C => {
    return class ConnectedComponent extends Component {
      render() {
        return (
          <Consumer store={store} watch={watch} map={mapStoreToProps} render={(data) => {
            const mapped = data && typeof data === 'object' ? (isInstanceOf(data, Store) ? data.getState() : data) : {}
            const props = { ...this.props, ...mapped }
            return <C {...props} />
          }} />
        )
      }
    }
  }

  return { useStore, connect }
}
