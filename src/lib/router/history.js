import { parseUrl, parseSearch, resolveUrl, revokeUrl, paramsToUrl, EventBase, noop } from '../utils.js'
import { isInheritedOf } from 'ts-fns'
import { Storage } from '../storage/storage.js'

const HISTORY_CLASSES = {}

export class History extends EventBase {
  constructor() {
    this.init()
  }

  init() {
    // should be override
  }

  /**
   * get url to parse to state
   * @param {string} abs
   * @param {string} mode
   * @returns {string} path like: root/child/sub
   */
  $getUrl(abs, mode) {
    const url = this.location.href;
    return this.$parseUrl(url, abs, mode);
  }
  $parseUrl(url, abs, mode) {
    const { base } = mode;
    return revokeUrl(base, revokeUrl(abs, url));
  }

  /**
   * url change work
   * @param {*} to
   * @param {*} replace
   * @param {*} abs
   * @param {*} mode
   */
  $setUrl(to, abs, mode, params, replace) {
    const url = this.$makeUrl(to, abs, mode, params)
    return this[replace ? 'replace' : 'push'](url)
  }

  /**
   * create url to patch to history
   * @param {*} to
   * @param {*} abs
   * @param {*} mode
   * @returns
   */
  $makeUrl(to, abs, mode, params) {
    return this.$discernUrl(to, abs, mode, params)
  }
  $discernUrl(to, abs, mode, params) {
    const search = (params ? '?' + paramsToUrl(params) : '')

    if (/^[a-z]+:\/\//.test(to)) {
      return to + search
    }

    if (/^\/[a-z]?/.test(to)) {
      return to + search
    }

    const { base } = mode
    const root = resolveUrl(base, abs)
    const url = resolveUrl(root, to)
    return url + search
  }

  replace() {
    throw new Error('[Nautil]: History.replace should be implemented')
  }

  push() {
    throw new Error('[Nautil]: History.push should be implemented')
  }

  back() {
    throw new Error('[Nautil]: History.back should be implemented')
  }

  forward() {
    throw new Error('[Nautil]: History.forward should be implemented')
  }

  action(fn) {
    const deferer = new Promise((resolve, reject) => {
      if (this.hasEvent('protect')) {
        this.emit('protect', resolve, reject)
      }
      else {
        resolve()
      }
    })
    if (fn) {
      deferer.then(fn).catch(noop).then((url) => {
        if (url) {
          this.emit('change', url)
        }
      })
    }
    return deferer
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

class MemoHistory extends History {
  init() {
    this.stack = []
    this.curr = 0
  }

  get location() {
    const href = this.stack[this.curr]
    const { pathname, search, hash } = parseUrl(href)
    const query = parseSearch(search)
    return { href, pathname, search, query, hash }
  }

  back() {
    this.action(() => {
      this.curr --
      const latest = this.stack[this.curr]
      return latest
    })
  }

  forward() {
    this.action(() => {
      this.curr ++
      const latest = this.stack[this.curr]
      return latest
    })
  }

  push(url) {
    this.action(() => {
      this.curr ++
      this.stack.push(url)
      return url
    })
  }

  replace(url) {
    this.action(() => {
      this.stack[this.curr] = url
      return url
    })
  }
}

const HISTORY_KEY = 'Nautil:history'

class StorageHistory extends MemoHistory {
  init() {
    super.init()

    this.$ready = new Promise(async (resolve) => {
      const { curr = 0, stack = [] } = await Storage.getItem(HISTORY_KEY) || {}
      this.stack = stack
      this.curr = curr
      if (stack.length || curr) {
        this.dispatch('change', stack[curr])
      }
      resolve()
    })
  }

  back() {
    this.action(async () => {
      await this.$ready

      this.curr --
      const latest = this.stack[this.curr]

      await Storage.setItem(HISTORY_KEY, {
        curr: this.curr,
        stack: this.stack,
      })

      return latest
    })
  }

  forward() {
    this.action(async () => {
      await this.$ready

      this.curr ++
      const latest = this.stack[this.curr]

      await Storage.setItem(HISTORY_KEY, {
        curr: this.curr,
        stack: this.stack,
      })

      return latest
    })
  }

  push(url) {
    this.action(async () => {
      await this.$ready

      this.curr ++
      this.stack.push(url)

      await Storage.setItem(HISTORY_KEY, {
        curr: this.curr,
        stack: this.stack,
      })

      return url
    })
  }

  replace(url) {
    this.action(async () => {
      await this.$ready

      this.stack[this.curr] = url

      await Storage.setItem(HISTORY_KEY, {
        curr: this.curr,
        stack: this.stack,
      })

      return url
    })
  }
}

History.implement('memo', MemoHistory)
History.implement('storage', StorageHistory)
