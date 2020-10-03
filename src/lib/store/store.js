import produce from 'immer'
import { parse, assign } from 'ts-fns'

export class Store {
  constructor(namespaces) {
    this.state = {}
    this.subscribers = []
    this.dispatch = this.dispatch.bind(this)
    this.combine(namespaces)
  }
  getState() {
    return this.state
  }
  subscribe(fn) {
    const index = this.subscribers.length
    this.subscribers.push(fn)
    return () => this.subscribers.splice(index, 1)
  }
  dispatch(keyPath, update) {
    if (arguments.length === 1) {
      update = keyPath
      keyPath = ''
    }

    const prev = this.state
    const next = produce(prev, (state) => {
      if (keyPath) {
        const node = parse(state, keyPath)
        const res = typeof update === 'function' ? update(node) : update
        if (typeof res !== 'undefined') {
          assign(state, keyPath, res)
        }
        return state
      }
      else {
        return typeof update === 'function' ? update(state) : update
      }
    })

    this.state = next
    this.subscribers.forEach((fn) => {
      fn(next, prev)
    })
  }
  combine(namespaces) {
    const { dispatch, state: storeState } = this

    const patchState = (name, state2) => {
      storeState[name] = state2
    }

    const patchDispatch = (name, actions) => {
      dispatch[name] = dispatch[name] || {}

      Object.keys(actions).forEach((key) => {
        const action = actions[key]
        if (typeof action !== 'function') {
          return
        }
        const fn = (...args) => {
          const dispatch2 = (keyPath, update) => {
            if (arguments.length === 1) {
              update = keyPath
              keyPath = ''
            }

            const chain = (
              Array.isArray(keyPath) ? [name, ...keyPath]
              : keyPath ? [name, keyPath]
              : [name]
            )

            dispatch(chain, update)
          }
          return action(dispatch2, ...args)
        }
        dispatch[name][key] = fn
      })
    }

    Object.keys(namespaces).forEach((name) => {
      const { state, ...actions } = namespaces[name]
      patchState(name, state)
      patchDispatch(name, actions)
    })
  }
}
export default Store
