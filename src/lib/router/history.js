import { parseUrl, parseSearch, resolveUrl, revokeUrl, paramsToUrl, EventBase } from '../utils.js'
import { isInheritedOf } from 'ts-fns'
import { Storage } from '../storage/storage.js'

const HISTORY_CLASSES = {}

export class History extends EventBase {
  constructor() {
    super()

    this.stack = []
    this.cursor = -1
    this.events = []

    this.init()
  }

  get location() {
    const href = this.stack[this.cursor]

    if (!href) {
      return {
        href: '/',
        pathname: '/',
        search: '',
        query: {},
        hash: '',
      }
    }

    const { pathname, search, hash } = parseUrl(href)
    const query = parseSearch(search)
    return { href, pathname, search, query, hash }
  }

  init() {
    // should be override
  }

  on(event, callback) {
    this.events.push({ event, callback })
  }

  off(event, callback) {
    this.events = this.events.filter((item) => !(item.event === event && item.callback === callback))
  }

  emit(event, ...args) {
    this.events.forEach((item) => {
      if (item.event === event) {
        item.callback(...args)
      }
    })
  }

  /**
   * get url to parse to state
   * @param {string} abs
   * @param {string} mode
   * @returns {string} path like: root/child/sub
   */
  getUrl(abs, mode) {
    const url = this.location.href
    return this.$parseUrl(url, abs, mode)
  }
  $parseUrl(url, abs, mode) {
    const { base } = mode
    return revokeUrl(base, revokeUrl(abs, url))
  }

  /**
   * url change work
   * @param {*} to
   * @param {*} replace
   * @param {*} abs
   * @param {*} mode
   */
  setUrl(to, abs, mode, params, replace) {
    const url = this.makeUrl(to, abs, mode, params)
    return this[replace ? 'replace' : 'push'](url)
  }
  /**
   * create new url only changing search query
   * @param {*} abs
   * @param {*} mode
   * @param {*} params
   * @returns
   */
  $makeSearchUrl(params = {}) {
    const { pathname, query } = this.location
    const nextQuery = { ...query, ...params }
    const nextSearch = paramsToUrl(nextQuery)
    const url = nextSearch ? pathname + '?' + nextSearch : pathname
    return url
  }
  /**
   * create url to patch to history
   * @param {*} to
   * @param {*} abs
   * @param {*} mode
   * @returns
   */
  makeUrl(to, abs, mode, params) {
    return this.$discernUrl(to, abs, mode, params)
  }
  $discernUrl(to, abs, mode, params) {
    if (to === '.') {
      return this.$makeSearchUrl(params)
    }

    const genedSearch = params ? paramsToUrl(params) : ''
    const search = genedSearch ? `?${genedSearch}` : ''

    // http://xxx.com/xxx | //xxx.com/xxx
    if (/^[a-z]+:\/\//.test(to) || /^\/\//.test(to)) {
      return to.indexOf('?') > -1 ? `${to}&${genedSearch}` : to + search
    }

    const { base } = mode

    // /a/b/c
    if (to[0] === '/') {
      const root = resolveUrl(base, to.substring(1))
      return root + search
    }

    const root = resolveUrl(base, abs)
    const url = resolveUrl(root, to)
    const res = url + search
    return res
  }

  replace(url) {
    this.stack[this.cursor] = url
    this.emit('change', url)
  }

  push(url) {
    this.cursor ++
    this.stack.push(url)
    this.emit('change', url)
  }

  back() {
    if (this.cursor > 0) {
      this.cursor --
      this.emit('change', this.stack[this.cursor])
    }
  }

  forward() {
    if (this.cursor < this.stack.length - 1) {
      this.cursor ++
      this.emit('change', this.stack[this.cursor])
    }
  }

  static createHistory(type) {
    const HistoryClass = HISTORY_CLASSES[type] || HISTORY_CLASSES[Object.keys(HISTORY_CLASSES)[0]]
    return new HistoryClass()
  }

  static implement(type, Impl) {
    if (!isInheritedOf(Impl, History)) {
      throw new Error('[Nautil]: History.impmenet should must given class inherit from History')
    }
    HISTORY_CLASSES[type] = Impl
  }
}

class MemoHistory extends History {}

const HISTORY_KEY = 'Nautil:history'

class StorageHistory extends MemoHistory {
  init() {
    super.init()

    // eslint-disable-next-line no-async-promise-executor
    this.$ready = new Promise(async (resolve) => {
      const { cursor = 0, stack = [] } = await Storage.getItem(HISTORY_KEY) || {}
      this.stack = stack
      this.cursor = cursor
      if (stack.length || cursor) {
        this.emit('change', stack[cursor])
      }
      resolve()
    })
  }

  async back() {
    if (this.cursor <= 0) {
      return
    }

    await this.$ready

    this.cursor --

    await Storage.setItem(HISTORY_KEY, {
      cursor: this.cursor,
      stack: this.stack,
    })

    this.emit('change', this.stack[this.cursor])
  }

  async forward() {
    if (this.cursor >= this.stack.length) {
      return
    }

    await this.$ready

    this.cursor ++

    await Storage.setItem(HISTORY_KEY, {
      cursor: this.cursor,
      stack: this.stack,
    })

    this.emit('change', this.stack[this.cursor])
  }

  async push(url) {
    await this.$ready

    this.cursor ++
    this.stack.push(url)

    await Storage.setItem(HISTORY_KEY, {
      cursor: this.cursor,
      stack: this.stack,
    })

    this.emit('change', url)
  }

  async replace(url) {
    await this.$ready

    this.stack[this.cursor] = url

    await Storage.setItem(HISTORY_KEY, {
      cursor: this.cursor,
      stack: this.stack,
    })

    this.emit('change', url)
  }
}

History.implement('memo', MemoHistory)
History.implement('storage', StorageHistory)
