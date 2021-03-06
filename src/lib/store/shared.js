import { Component } from '../component.js'
import { useStore as originUseStore, Consumer } from './consumer.jsx'

export function applyStore(store) {
  const useStore = (watch) => originUseStore(store, watch)
  const connect = (mapToProps, watch) => C => {
    return class ConnectedComponent extends Component {
      render() {
        return (
          <Consumer store={store} watch={watch} map={mapToProps} render={(data) => {
            const mapped = isInstanceOf(data, Store) ? data.getState() : data
            const props = { ...this.props, ...mapped }
            return <C {...props} />
          }} />
        )
      }
    }
  }

  return { useStore, connect }
}
