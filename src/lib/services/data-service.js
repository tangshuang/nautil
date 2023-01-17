import { Service } from '../core/service.js'
import { isString } from 'ts-fns'
import { source, query, compose, setup, release, affect, select, apply, ref, isSource, request, action } from 'algeb'
import { useSource } from 'algeb/react'

const subscribersKey = Symbol()

export class DataService extends Service {
  constructor() {
    super()
    this[subscribersKey] = []
  }

  source(get, value) {
    return source(get, value)
  }

  compose(get) {
    return compose(get)
  }

  action(act) {
    return action(act)
  }

  _parse(source) {
    if (isString(source)) {
      if (!this[source]) {
        throw new Error(`${source} is not in DataService`)
      }
      source = this[source]
      if (!isSource(source)) {
        throw new Error(`${source} is not a data source`)
      }
    }
    return source
  }

  query(source, ...params) {
    const src = this._parse(source)
    const [data, renew] = query(src, ...params)
    const act = (...args) =>
      renew(...args).then((value) => {
        this._dispatch(src, params, value)
        return value
      })
    return [data, act]
  }

  get(source, ...params) {
    const [data] = this.query(source, ...params)
    return data
  }

  request(source, ...params) {
    const src = this._parse(source)
    return request(src, ...params).then((value) => {
      this._dispatch(src, params, value)
      return value
    })
  }

  subscribe(fn) {
    this[subscribersKey].push(fn)
  }

  unsubscribe(fn) {
    this[subscribersKey].forEach((item, i) => {
      if (item === fn) {
        this[subscribersKey].splice(i, 1)
      }
    })
  }

  _dispatch(source, params, value) {
    this[subscribersKey].forEach((fn) => {
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

  static source(get, value) {
    return source(get, value)
  }

  static compose(get) {
    return compose(get)
  }

  static action(act) {
    return action(act)
  }

  static query(source, ...params) {
    return query(source, ...params)
  }

  static get(source, ...params) {
    const [data] = query(source, ...params)
    return data
  }

  static request(source, ...params) {
    return request(source, ...params)
  }

  static setup(run) {
    return setup(run)
  }

  static release(sources) {
    return release(sources)
  }

  static affect(invoke, deps) {
    return affect(invoke, deps)
  }

  static select(compute, deps) {
    return select(compute, deps)
  }

  static apply(get, value) {
    return apply(get, value)
  }

  static ref(value) {
    return ref(value)
  }
}

export {
  isSource as isDataSource,
  useSource as useDataSource,
}
