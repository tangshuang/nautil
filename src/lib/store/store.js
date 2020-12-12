import produce from 'immer'

export class Store {
  constructor(initState = {}) {
    this._subscribers = []
    this._state = initState
    this._origin = initState
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
    return this._state
  }
  resetState() {
    this.dispatch(this._origin)
  }
  setState(state) {
    this.dispatch(draft => { Object.assign(draft, state) })
  }
  dispatch(update) {
    const prev = this._state
    const next = typeof update === 'function' ? produce(prev, update) : update
    this._state = next
    this._subscribers.forEach((fn) => {
      fn(next, prev)
    })
  }
}
export default Store
