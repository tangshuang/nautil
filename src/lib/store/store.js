import produce from 'immer'
import { isObject, getConstructorOf, assign } from 'ts-fns'
import { createTwoWayBinding } from '../utils.js'

export class Store {
  constructor(initState) {
    const Constructor = getConstructorOf(this)
    const origin = initState ? initState : Constructor.initState ? Constructor.initState() : {}

    this.state = origin
    this._subscribers = []
    this._origin = origin

    if (origin && typeof origin === 'object') {
      this.$state = createTwoWayBinding(this.state, (_, keyPath, value) => {
        this.update((state) => {
          assign(state, keyPath, value)
        })
      })
    }

    // bind to store, so that we can destruct from store
    this.update = this.update.bind(this)
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
  dispatch(...args) {
    this._subscribers.forEach((fn) => {
      fn(...args)
    })
  }
  getState() {
    return this.state
  }
  resetState() {
    this.update(this._origin)
  }
  setState(state) {
    this.update(draft => {
      if (!isObject(draft)) {
        return state
      }
      Object.assign(draft, state)
    })
  }
  update(updator) {
    const prev = this.state
    const next = typeof updator === 'function' ? produce(prev, updator) : updator
    this.state = next

    if (next && typeof next === 'object') {
      this.$state = createTwoWayBinding(this.state, (_, keyPath, value) => {
        this.update((state) => {
          assign(state, keyPath, value)
        })
      })
    }
    else {
      delete this.$state
    }

    this.dispatch(prev, next)
  }
}
export default Store
