import { ifexist, Enum, List, nonable } from 'tyshemo'
import { isArray, isInstanceOf, parse } from 'ts-fns'

import { useForceUpdate } from '../hooks/force-update.js'
import Component from '../component.js'
import Store from './store.js'
import { isShallowEqual } from '../utils.js'

export class _Consumer extends Component {
  static props = {
    store: Store,
    map: nonable(Function),
    watch: nonable(new Enum([String, new List([String])])),
    render: ifexist(Function),
  }

  _latestState = null
  _latestMapped = null

  watch = (next, prev) => {
    const { watch } = this.attrs
    if (!watch) {
      this.forceUpdate()
      return
    }

    const items = isArray(watch) ? watch : [watch]
    const latest = {}
    const current = {}
    items.forEach((key) => {
      current[key] = parse(next, key)
      latest[key] = parse(prev, key)
    })

    if (!isShallowEqual(current, latest)) {
      this.forceUpdate()
    }
  }

  shouldUpdate() {
    return false
  }

  onMounted() {
    const { store } = this.attrs
    store.subscribe(this.watch)
  }

  onUnmount() {
    const { store } = this.attrs
    store.unsubscribe(this.watch)

    this._latestMapped = null
    this._latestState = null
  }

  render() {
    const { store, map, render } = this.attrs
    const fn = render ? render : this.children

    const currentState = store.getState()
    const data = map ? (this._latestState && this._latestMapped && this._latestState === currentState ? this._latestMapped : map(store)) : store

    this._latestState = currentState
    this._latestMapped = data

    return fn(data)
  }
}
export class Consumer extends Component {
  render() {
    return <_Consumer {...this.props} />
  }
}

export default Consumer

export const connect = (mapToProps, watch) => C => {
  return class ConnectedComponent extends Component {
    render() {
      return (
        <Consumer watch={watch} map={mapToProps} render={(data) => {
          const mapped = isInstanceOf(data, Store) ? data.getState() : data
          const props = { ...this.props, ...mapped }
          return <C {...props} />
        }} />
      )
    }
  }
}

export function useStore(store, watch) {
  const update = useForceUpdate()
  useEffect(() => {
    const forceUpdate = (next, prev) => {
      if (!watch) {
        update({})
        return
      }

      const items = isArray(watch) ? watch : [watch]
      const latest = {}
      const current = {}
      items.forEach((key) => {
        current[key] = parse(next, key)
        latest[key] = parse(prev, key)
      })

      if (!isShallowEqual(current, latest)) {
        update()
      }
    }
    store.subscribe(forceUpdate)
    return () => store.unsubscribe(forceUpdate)
  }, [])
  return store
}
