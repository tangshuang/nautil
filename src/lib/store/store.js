import produce from 'immer'
import { isObject } from 'ts-fns'

export class Store {
  constructor(initState = {}) {
    this.state = initState
    this._subscribers = []
    this._origin = initState

    // bind to store, so that we can destruct from store
    this.dispatch = this.dispatch.bind(this)
    this.setState = this.setState.bind(this)
    this.getState = this.getState.bind(this)
  }
  subscribe(fn) {
    this._subscribers.push(fn)
  }
  unsubscribe(fn) {
    this._subscribers.forEach((item, i) => {
      if (item === fn) {
        this._subscribers.splice(i, 1)
      }
    })
  }
  getState() {
    return this.state
  }
  resetState() {
    this.dispatch(this._origin)
  }
  setState(state) {
    this.dispatch(draft => {
      if (!isObject(draft)) {
        return state
      }
      Object.assign(draft, state)
    })
  }
  dispatch(update) {
    const prev = this.state
    const next = typeof update === 'function' ? produce(prev, update) : update
    this.state = next
    this._subscribers.forEach((fn) => {
      fn(next, prev)
    })
  }
}
export default Store
