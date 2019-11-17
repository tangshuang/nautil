import Depository from '../core/depository.js'
import { attachPrototype } from '../core/utils.js'
import StorageX from 'storagex'
import axios from 'axios'

attachPrototype(Depository, {
  init() {
    const {
      name, storage, stringify, async, expire,
      baseURL, headers,
      sources,
    } = this.options

    this.store = new StorageX({
      namespace: name,
      storage, stringify, async, expire,
    })
    this.axios = axios.create({
      baseURL, headers,
    })

    if (sources) {
      this.register(sources)
    }
  },
})
