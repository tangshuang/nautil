import { ifexist, Enum, List, nonable } from 'tyshemo'
import { isArray, isInstanceOf, parse, isFunction } from 'ts-fns'
import { useEffect } from 'react'

import { useForceUpdate } from '../hooks/force-update.js'
import Component from '../component.js'
import Store from './store.js'
import { isShallowEqual } from '../utils.js'
import { Observer } from '../components/observer.jsx'

import { Consumer as ContextConsumer } from './context.js'

export class Consumer extends Component {
  static props = {
    store: Store,
    map: nonable(Function),
    watch: nonable(new Enum([String, new List([String])])),
    render: ifexist(Function),
  }

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
    return (
      <ContextConsumer>
        {(provided) => {
          const { store: givenStore, map, render } = this.attrs
          const store = givenStore || provided
          const fn = render ? render : this.children

          const data = map ? map(store) : store.getState()

          return (
            <Observer
              subscribe={() => store.subscribe(this.watch)}
              unsubscribe={() => store.unsubscribe(this.watch)}
            >{fn(data)}</Observer>
          )
        }}
      </ContextConsumer>
    )
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
        update()
        return
      }

      if (isFunction(watch)) {
        const res = watch(next, prev)
        if (res) {
          update()
        }
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
