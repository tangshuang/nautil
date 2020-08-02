import Depsitory from '../core/depository.js'
import StorageX from 'storagex'
import axios from 'axios'
import { attachPrototype } from '../utils.js'

attachPrototype(Depsitory, {
  setConfig(options = {}) {
    this.options = { ...this.options, ...options }
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
  },
})
