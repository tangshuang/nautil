import { interpolate, getObjectHash, mergeObjects, isObject, isArray, isObjectsEqual, isFunction } from './utils.js'
import axios from 'axios'
import StorageX from 'storagex'

export class Depository {

  static defaultOptions = {
    // depository name
    name: 'nautil',

    // default options for axios
    baseURL: '',
    headers,
    timeout,

    // default options for storagex
    storage: null,
    stringify: false,
    async: false,
    expire: 0,
  }

  constructor(options = {}) {
    this.options = mergeObjects(DataBaxe.defaultOptions, options)

    const {
      name, storage, stringify, async, expire,
      baseURL, headers, timeout,
    } = this.options
    this.store = new StorageX({
      namespace: name,
      storage, stringify, async, expire,
    })
    this.axios = axios.create({
      baseURL, headers, timeout,
    })

    this.datasources = {}
    this.subscriptions = []

    this._requesting = {}
    this._saving = {}
    this._deps = []
    this._dep = null
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
        transformer,
        validateStatus,
        validateData,
      } = datasource
      this.datasources[id] = { url, method, headers, transformer, validateStatus, validateData }
    })
  }

  subscribe(id, callback, priority = 10) {
    const datasource = this.datasources[id]
    if (!datasource) {
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
  }

  unsubscribe(id, callback) {
    const datasource = this.datasources[id]
    if (!datasource) {
      throw new Error('data source ' + id + ' is not exists.')
    }

    const subscriptions = this.subscriptions
    subscriptions.forEach((item, i) => {
      if (item.id === id && (callback === undefined || item.callback === callback)) {
        callbacks.splice(i, 1)
      }
    })
  }

  _dispatch(id, data, params) {
    const datasource = this.datasources[id]
    if (!datasource) {
      throw new Error('data source ' + id + ' is not exists.')
    }

    const { url, method, headers } = datasource
    const hash = getObjectHash({ url, method, headers, params })
    this.store.set(hash, data)

    const subscriptions = this.subscriptions.filter(item => item.id === id)
    subscriptions.forEach(({ callback }) => {
      callback.call(this, { id, data, params })
    })
  }

  request(id, params) {
    const datasource = this.datasources[id]
    if (!datasource) {
      throw new Error('data source ' + id + ' is not exists.')
    }

    const {
      url,
      method,
      headers,
      validateStatus,
      validateData,
    } = datasource
    const requestUrl = isObject(params) ? interpolate(url, params) : url
    const config = {
      url: requestUrl,
      method,
      headers,
    }

    if (method && ['get', 'post', 'headers', 'options'].indexOf(method) === -1) {
      throw new Error('method:' + method + ' is not allowed when you request data.')
    }
    if (method === 'post') {
      config.data = params
    }

    const hash = getObjectHash({ url, method, headers, params })

    if (this._requesting[hash]) {
      return this._requesting[hash]
    }

    this._requesting[hash] = axios(config).then((res) => {
      const { data } = res

      if (isFunction(validateStatus)) {
        validateStatus(res.status)
      }

      if (isFunction(validateData)) {
        validateData(data)
      }

      return data
    }).then((data) => {
      this._dispatch(id, data, params)
      return data
    }).finally(() => {
      this._requesting[hash] = null
    })

    return this._requesting[hash]
  }

  _wrapDep(fun) {
    this._dep = { target: fun }
    fun()
    this._dep = null
  }
  _addDep() {
    const dep = this._dep

    if (this._deps.find(item => item.id === dep.id && item.target === dep.target)) {
      return false
    }

    const callback = ({ id, params }) => {
      if (id === dep.id && isObjectsEqual(params, dep.params)) {
        this._wrapDep(dep.target)
      }
    }

    this._deps.push(dep)
    this.subscribe(dep.id, callback)

    return true
  }

  get(id, params, force = false) {
    const datasource = this.datasources[id]
    if (!datasource) {
      throw new Error('data source ' + id + ' is not exists.')
    }

    const { url, method, headers, transformer } = datasource

    if (method && ['get', 'post', 'headers', 'options'].indexOf(method) === -1) {
      throw new Error('method:' + method + ' is not allowed when you get data.')
    }

    // add dependences
    if (this._dep && this._dep.target) {
      this._dep.id = id
      this._dep.params = params
      this._addDep()
    }

    const hash = getObjectHash({ url, method, headers, params })
    const data = this.store.get(hash)

    // the first time to request data from backend
    if (!data) {
      request()
      return
    }

    if (force) {
      request(id, params)
    }

    const result = isFunction(transformer) ? transformer(data) : data
    return result
  }

  save(id, params, data) {
    const datasource = this.datasources[id]
    if (!datasource) {
      throw new Error('data source ' + id + ' is not exists.')
    }

    const { url, method, headers } = datasource

    if (['post', 'put', 'delete', 'patch'].indexOf(method) === -1) {
      throw new Error(`you should not save data with not ${method} method datasource.`)
    }

    const requestUrl = isObject(params) ? interpolate(url, params) : url
    const config = {
      url: requestUrl,
      method,
      headers,
    }

    const hash = getObjectHashcode(config)
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

    return Promise((resolve, reject) => {
      tx.timer = setTimeout(() => {
        if (method !== 'delete') {
          config.data = data
        }

        tx.timer = null
        tx.data = {}

        axios(config).then(res => res.data).then(resolve).catch(reject)
      })
    })
  }

  autorun(funcs) {
    if (!isArray(funcs)) {
      funcs = [funcs]
    }
    funcs.forEach(fun => this._wrapDep(fun))
  }

  autofree(funcs) {
    if (!isArray(funcs)) {
      funcs = [funcs]
    }
    funcs.forEach((fun) => {
      const deps = this._deps.filter(item => item.target === fun)
      deps.forEach((dep, i) => {
        this.unsubscribe(dep.id, dep.callback)
        deps.splice(i, 1)
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
