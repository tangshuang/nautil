import { interpolate, getObjectHash, isArray, isFunction, isInstanceOf } from './utils.js'
import axios from 'axios'
import StorageX from 'storagex'

export class Depository {
  static defaultOptions = {
    // depository name
    name: 'nautil',

    // default options for axios
    baseURL: '',
    headers: {},
    data: {},
    timeout: 30000,

    // default options for storagex
    storage: null,
    stringify: false,
    async: false,
    expire: 0,
  }

  constructor(options = {}) {
    this.options = { ...Depository.defaultOptions, ...options }

    this.datasources = {}
    this.subscriptions = []

    this._requesting = {}
    this._saving = {}
    this._deps = []
    this._dep = null

    this.init(options)
  }

  init() {
    const {
      name, storage, stringify, async, expire,
      baseURL, headers, timeout,
      sources,
    } = this.options

    this.store = new StorageX({
      namespace: name,
      storage, stringify, async, expire,
    })
    this.axios = axios.create({
      baseURL, headers, timeout,
    })

    if (sources) {
      this.register(sources)
    }
  }

  register(datasources) {
    if (!isArray(datasources)) {
      datasources = [datasources]
    }

    datasources.forEach((datasource) => {
      const {
        id,
        url,
        method,
        headers,
        data, // default post data when method is 'post'
        poll, // for short poll, should be a function to return true or false
        transformer,
        validateStatus,
        validateData,
      } = datasource
      this.datasources[id] = { url, method, headers, data, transformer, validateStatus, validateData, poll }
    })

    return this
  }

  subscribe(id, callback, priority = 10) {
    if (isArray(id)) {
      const ids = id
      ids.forEach(id => this.subscribe(id, callback, priority))
      return this
    }

    const datasource = this.datasources[id]
    if (!datasource && id !== '*') {
      throw new Error('data source ' + id + ' is not existing.')
    }

    if (!isFunction(callback)) {
      return
    }

    const subscriptions = this.subscriptions
    const subscription = {
      id,
      callback,
      priority,
    }

    for (let i = 0, len = subscriptions.length; i <= len; i ++) {
      if (i === len) {
        subscriptions.push(subscription)
      }
      else {
        const item = subscriptions[i]
        if (priority < item.priority) {
          subscriptions.push(subscription)
          break
        }
      }
    }

    return this
  }

  unsubscribe(id, callback) {
    if (isArray(id)) {
      const ids = id
      ids.forEach(id => this.unsubscribe(id, callback))
      return this
    }

    const datasource = this.datasources[id]
    if (!datasource && id !== '*') {
      throw new Error('data source ' + id + ' is not exists.')
    }

    const subscriptions = this.subscriptions
    subscriptions.forEach((item, i) => {
      if (item.id === id && (callback === undefined || item.callback === callback)) {
        subscriptions.splice(i, 1)
      }
    })

    return this
  }

  _dispatch(id, params, data) {
    const datasource = this.datasources[id]
    if (!datasource) {
      throw new Error('data source ' + id + ' is not exists.')
    }

    const { url, method, headers } = datasource
    const hash = getObjectHash({ url, method, headers, params })
    this.store.set(hash, data)

    const subscriptions = this.subscriptions.filter(item => item.id === id)
    subscriptions.forEach(({ callback }) => {
      callback.call(this, data, params)
    })

    const callbacks = this.subscriptions.filter(item => item.id === '*')
    callbacks.forEach(({ callback }) => {
      callback.call(this, data, params)
    })
  }

  request(id, params = {}) {
    const datasource = this.datasources[id]
    if (!datasource) {
      throw new Error('data source ' + id + ' is not exists.')
    }

    const {
      url,
      method,
      headers,
      data = {},
      poll,
      validateStatus,
      validateData,
    } = datasource

    const usedKeys = []
    url.replace(/\{(.*?)\}/g, (matched, key) => usedKeys.push(key))

    const query = { ...params }
    const inters = {}

    usedKeys.forEach((key) => {
      inters[key] = query[key]
      delete query[key]
    })

    const requestUrl = interpolate(url, inters)
    const config = {
      url: requestUrl,
      method,
      headers,
      validateStatus,
    }

    if (method && ['get', 'post', 'headers', 'options'].indexOf(method) === -1) {
      throw new Error('method:' + method + ' is not allowed when you request data.')
    }
    if (method === 'post') {
      config.data = { ...data, ...query }
    }
    else {
      config.params = { ...data, ...query }
    }

    const hash = getObjectHash({ url, method, headers, params })

    if (this._requesting[hash]) {
      return this._requesting[hash]
    }

    const request = (delay = 1000) => {
      return this.axios.request(config).then((res) => {
        if (isFunction(poll)) {
          if (poll(res)) {
            return res
          }
          else {
            return new Promise((resolve, reject) => {
              if (delay > 5000) {
                delay = 1000
              }
              setTimeout(() => request(delay + 1000).then(resolve).catch(reject), delay)
            })
          }
        }
        return res
      })
    }

    this._requesting[hash] = request().then((res) => {
      const { data } = res

      if (isFunction(validateData)) {
        const error = validateData(data)
        if (isInstanceOf(error, Error)) {
          throw error
        }
      }

      return data
    }).then((data) => {
      this._dispatch(id, params, data)
      return data
    }).finally(() => {
      this._requesting[hash] = null
    })

    return this._requesting[hash]
  }

  get(id, params = {}) {
    const datasource = this.datasources[id]
    if (!datasource) {
      throw new Error('data source ' + id + ' is not exists.')
    }

    const { url, method, headers, transformer } = datasource

    if (method && ['get', 'post', 'headers', 'options'].indexOf(method) === -1) {
      throw new Error('method:' + method + ' is not allowed when you get data.')
    }

    const hash = getObjectHash({ url, method, headers, params })
    const data = this.store.get(hash)

    const response = (data) => {
      // the first time to request data from backend
      if (!data) {
        this.request(id, params)
        return
      }

      const result = isFunction(transformer) ? transformer(data) : data
      return result
    }

    // for async storage
    if (this.options.async) {
      return data.then(response)
    }
    else {
      return response(data)
    }
  }

  save(id, params = {}) {
    const datasource = this.datasources[id]
    if (!datasource) {
      throw new Error('data source ' + id + ' is not exists.')
    }

    const { url, method, headers } = datasource

    if (['post', 'put', 'delete', 'patch'].indexOf(method) === -1) {
      throw new Error(`you should not save data with not ${method} method datasource.`)
    }

    const usedKeys = []
    url.replace(/\{(.*?)\}/g, (matched, key) => usedKeys.push(key))

    const data = { ...params }
    const inters = {}

    usedKeys.forEach((key) => {
      inters[key] = data[key]
      delete data[key]
    })

    const requestUrl = interpolate(url, inters)
    const config = {
      url: requestUrl,
      method,
      headers,
    }

    const hash = getObjectHash(config)
    this._saving[hash] = this._saving[hash] || {
      timer: null,
      data: {},
      deferer: null,
    }

    const tx = this._saving[hash]

    Object.assign(tx.data, data)
    clearTimeout(tx.timer)

    if (tx.deferer) {
      return tx.deferer
    }

    return new Promise((resolve, reject) => {
      tx.timer = setTimeout(() => {
        if (method !== 'delete') {
          config.data = data
        }

        tx.timer = null
        tx.data = {}

        this.axios.request(config).then(res => res.data).then(resolve).catch(reject)
      })
    })
  }

  destroy() {
    this.options = null
    this.store = null
    this.axios = null

    this.datasources = null
    this.subscriptions = null

    this._requesting = null
    this._saving = null
    this._deps = null
    this._dep = null
  }
}

export default Depository
