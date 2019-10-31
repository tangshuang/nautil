import Depository from '../core/depository.js'

Object.assign(Depository.prototype, {
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
