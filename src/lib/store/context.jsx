import { createContext, useContext } from 'react'
import { Store } from './store.js'
import { Component } from '../../lib/core/component.js'

import { ifexist, Enum, List } from 'tyshemo'
import { isArray, isInstanceOf, parse, isFunction } from 'ts-fns'
import { useEffect } from 'react'

import { useForceUpdate } from '../hooks/force-update.js'
import { isShallowEqual } from '../utils.js'

const storeContext = createContext()

export class Provider extends Component {
  static props = {
    store: Store,
  }

  render() {
    const { Provider } = storeContext
    const { store } = this.props
    return (
      <Provider value={store}>
        {this.children}
      </Provider>
    )
  }
}

class LocalConsumer extends Component {
  static props = {
    store: Store,
    map: ifexist(Function),
    watch: ifexist(new Enum([String, new List([String])])),
    render: ifexist(Function),
  }

  goToUpdate = (next, prev) => {
    const { watch } = this.attrs
    if (!watch) {
      this.update()
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
      this.update()
    }
  }

  onInit() {
    this.store = null
  }

  shouldAffect() {
    const { store } = this.attrs
    return [store]
  }

  onAffect() {
    const { store } = this.attrs
    if (this.store && this.store !== store) {
      this.store.unsubscribe(this.goToUpdate)
    }
    this.store = store
    store.subscribe(this.goToUpdate)
  }

  render() {
    const { store, map, render } = this.attrs
    const fn = render ? render : this.children
    const data = map ? map(store) : store
    return fn(data)
  }
}

export class Consumer extends Component {
  static props = {
    store: ifexist(Store),
    map: ifexist(Function),
    watch: ifexist(new Enum([String, new List([String])])),
    render: ifexist(Function),
  }

  render() {
    const { Consumer } = storeContext
    const { store, ...attrs } = this.props

    if (store) {
      return <LocalConsumer store={store} {...attrs} />
    }

    return <Consumer>{store => <LocalConsumer store={store} {...attrs} />}</Consumer>
  }
}

export const connect = (mapStoreToProps, watch) => C => {
  return class ConnectedComponent extends Component {
    render() {
      return (
        <Consumer watch={watch} map={mapStoreToProps} render={(data) => {
          const mapped = data && typeof data === 'object' ? (isInstanceOf(data, Store) ? data.getState() : data) : {}
          const props = { ...this.props, ...mapped }
          return <C {...props} />
        }} />
      )
    }
  }
}

export function useLocalStore(store, watch) {
  const forceUpdate = useForceUpdate()
  useEffect(() => {
    const goToUpdate = (next, prev) => {
      if (!watch) {
        forceUpdate()
        return
      }

      if (isFunction(watch)) {
        const res = watch(next, prev)
        if (res) {
          forceUpdate()
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
        forceUpdate()
      }
    }
    store.subscribe(goToUpdate)
    return () => store.unsubscribe(goToUpdate)
  }, [])
  return store
}

export function useStore(watch) {
  const store = useContext(storeContext)
  return useLocalStore(store, watch)
}
