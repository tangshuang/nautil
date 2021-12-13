import { Service } from '../service.js'
import { isString, isObject } from 'ts-fns'
import { source, query, compose, setup, release, affect, select, apply, ref } from 'algeb'
export class DataService extends Service {
  _subscribers = []

  source(get, value) {
    return source(get, value)
  }

  compose(get) {
    return compose(get)
  }

  query(source, ...params) {
    if (isString(source)) {
      if (!this[source]) {
        throw new Error(`${source} is not in DataService`)
      }
      source = this[source]
      if (!isObject(source) || source.type !== 1) {
        throw new Error(`${source} is not a data source`)
      }
    }

    const [data, renew] = query(source, ...params)
    const act = (...args) => {
      return renew(...args).then((value) => {
        this._dispatch(source, params, value)
        return value
      })
    }
    return [data, act]
  }

  get(source, ...params) {
    const [data] = this.query(source, ...params)
    return data
  }

  renew(source, ...params) {
    const [, renew] = this.query(source, ...params)
    return renew()
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

  _dispatch(source, params, value) {
    this._subscribers.forEach((fn) => {
      fn(source, params, value)
    })
  }

  setup(run) {
    return setup(run)
  }

  release(sources) {
    return release(sources)
  }

  // hooks -------------

  affect(invoke, deps) {
    return affect(invoke, deps)
  }

  select(compute, deps) {
    return select(compute, deps)
  }

  apply(get, value) {
    return apply(get, value)
  }

  ref(value) {
    return ref(value)
  }
}
