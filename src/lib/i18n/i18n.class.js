import { extend, parse, interpolate, isArray, isObject, isString, isUndefined, createDate } from 'ts-fns'

export class I18n {
  /**
   * @param {object} options.resources default language resources, key is the name of the package, value is the language key-value pairs
   * @param {string} lanuage default language, should be one of the package names,
   * name rule should follow Intl https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
   * language formatter should be subtag + region, i.e. zh-CN, en-US
   */
  constructor(options = {}) {
    const { resources = {}, lanuage } = options

    this.namespaces = {
      default: resources,
    }
    this.lng = lanuage
    this.fallbackLng = lanuage

    // for definitions
    this.watchers = []
    this.isUsed = 0
    // for events
    this.events = []

    this.t = this.t.bind(this)
    this.setLng = this.setLng.bind(this)
    this.setRes = this.setRes.bind(this)
  }

  on(name, fn) {
    this.events.push({ name, fn })
    return () => this.off(name, fn)
  }

  off(name, fn) {
    this.events.forEach((item, i) => {
      if (item.name === name && item.fn === fn) {
        this.events.splice(i, 1)
      }
    })
  }

  setLng(lng) {
    if (this.lng === lng) {
      return
    }

    this.lng = lng

    // update constants
    this.watchers.forEach(([constant, define]) => {
      const localeConst = define()
      extend(constant, localeConst)
    })

    this.events.forEach(({ name, fn }) => {
      if (name === 'changeLanguage') {
        fn(lng)
      }
    })
  }

  setRes(resources, namespace = 'default') {
    const oldResources = this.namespaces[namespace] || {}
    this.namespaces[namespace] = {
      ...oldResources,
      ...resources,
    }

    // update constants
    this.watchers.forEach(([constant, define]) => {
      const localeConst = define()
      extend(constant, localeConst)
    })

    this.events.forEach(({ name, fn }) => {
      if (name === 'changeResources') {
        fn(namespace, resources)
      }
      else if (name === `changeResources:${namespace}`) {
        fn(namespace, resources)
      }
    })
  }

  /**
   * parse word by language
   * @param {*} lng
   * @param {*} key
   * @param {*} params
   * @returns
   */
  parse(lng, key, params) {
    // use lazy key
    if (key && typeof key === 'object' && key.$$type === 'i18nKey') {
      key = key.key
    }

    const getMessage = (key) => {
      // support use `:` to seperate namespace, i.e. SOME_NAMESPACE:key
      const [namespace, keyPath] = key.indexOf(':') > 0 ? key.split(':') : ['default', key]

      const pkgs = this.namespaces[namespace]
      const hasLngPkg = pkgs && pkgs[lng]
      const pkgLng = hasLngPkg ? lng : this.fallbackLng
      const pkg = pkgs && pkgs[pkgLng] ? pkgs[pkgLng] : {}

      if (typeof pkg === 'function') {
        const lazy = pkg(lng)
        if (lazy && lazy instanceof Promise) {
          lazy.then((pkg) => {
            this.setRes({
              [pkgLng]: pkg,
            }, namespace)
          })
          return
        }
        else if (lazy) {
          if (!pkgs) {
            this.namespaces[namespace] = {}
          }
          pkgs[pkgLng] = lazy
        }
      }

      const message = pkg ? pkg[keyPath] ? pkg[keyPath] : parse(pkg, keyPath) : void 0
      return message
    }

    const formatMessage = (message) => {
      // message may not be string, sometimes will get object or array
      const out = isString(message) ? interpolate(message, params || {}) : message
      return out
    }

    // if key is array, try them one by one, if not find, return the last key as output
    if (isArray(key)) {
      const keys = key
      let fallback = ''
      for (let i = 0, len = keys.length; i < len; i ++) {
        const key = keys[i]
        const message = getMessage(key)
        if (!isUndefined(message)) {
          const text = formatMessage(message)
          return text
        }
        fallback = key
      }
      return fallback
    }

    const message = getMessage(key)
    if (!message) {
      return key
    }

    const out = formatMessage(message)
    return out
  }

  /**
   * get locale text by key
   * @param {string} key key path expression, i.e. body.hand, some.books.0, some.books[0], some.books[a.b]
   * @param {object} params interplote values, i.e. 'count is {num}' <- { num: 1 }
   */
  t(key, params) {
    // record define constant used t
    if (this.isUsed === 1) {
      this.isUsed = 2
    }

    const lng = this.lng

    // use lazy key
    if (key && typeof key === 'object' && key.$$type === 'i18nKey') {
      key = key.key
    }

    return this.parse(lng, key, params)
  }

  /**
   * define constants, after setLang, constants will be changed too
   * @param {function} define
   * @example const SOME_CONST = i18n.define((t) => {
   *   return {
   *     NAME: t('some.name'),
   *     AGE: t('some.age'),
   *   }
   * })
   */
  define(define) {
    // record used 1, only used=1 can be turned to 2
    this.isUsed = 1

    const localeConst = define(this.t.bind(this))

    // can be not string
    if (!isArray(localeConst) && !isObject(localeConst)) {
      return localeConst
    }

    const constant = isArray(localeConst) ? [] : {}

    Object.assign(constant, localeConst)

    // watch changes
    if (this.isUsed === 2) {
      this.watchers.push([constant, define])
    }

    // reset
    this.isUsed = 0

    return constant
  }

  /**
   * apply a lazy word
   * @param {*} key
   * @param {*} ns
   * @returns
   * @example
   * const SOME_WORD = i18n.apply('some_key')
   * <span>{SOME_WORD}</span>
   */
  apply(key) {
    return {
      $$type: 'i18nKey',
      key,
      valueOf: () => {
        return this.t(key)
      },
    }
  }

  /**
   * get key of a language in an object, i.e. name to be name_zh or name_en, if not exisiting, use name
   * @param {string} key
   * @param {object} [data]
   */
  getKey(key, data) {
    const [lng] = this.lng.split(/-|_/)
    const i18nKey = `${key}_${lng}`
    if (isUndefined(data)) {
      return i18nKey
    }
    else if (data && i18nKey in data) {
      return i18nKey
    }
    else {
      return key
    }
  }

  /**
   * get value by key of a language
   * @param {string} key
   * @param {object} data
   */
  getValue(key, data) {
    const [lng] = this.lng.split(/-|_/)
    const i18nKey = `${key}_${lng}`
    if (i18nKey in data) {
      return data[i18nKey]
    }
    else {
      return data[key]
    }
  }

  /**
   * format number to locale formatter
   * @param {number} num
   * @param {*} options
   * @returns
   */
  getLocaleNumber(num, options) {
    return new Intl.NumberFormat(this.lng, options).format(num)
  }

  /**
   * format date to locale formatter
   * @param {Date|string|number} date
   * @param {*} options
   * @returns
   */
  getLocaleDate(date, options) {
    return new Intl.DateTimeFormat(this.lng, options).format(createDate(date))
  }

  /**
   * format number to locale currency formatter
   * @param {number} num
   * @param {string} currency i.e. USD, CNY
   * @param {*} options
   * @returns
   */
  getLocaleCurrency(num, currency, options = {}) {
    return new Intl.NumberFormat(this.lng, { ...options, style: 'currency', currency }).format(num)
  }

  getLocaleTimezoneOffset() {
    return -(new Date().getTimezoneOffset()/60)
  }

  getLocaleTimezoneOffsetSTD() {
    return -(new Date(new Date().getFullYear(), 0, 1).getTimezoneOffset()/60)
  }

  getLocaleDateByUTC(utcDateString) {
    const utcDate = createDate(utcDateString)
    const [Y, M, D, h, m, s, ms] = [utcDate.getFullYear(), utcDate.getMonth(), utcDate.getDate(), utcDate.getHours(), utcDate.getMinutes(), utcDate.getSeconds(), utcDate.getMilliseconds()]
    const gmtDate = new Date(Date.UTC(Y, M, D, h, m, s, ms))
    return gmtDate
  }

  getUTCDate() {
    const date = new Date()
    const [Y, M, D, h, m, s, ms] = [date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()]
    const utcDate = new Date(Y, M, D, h, m, s, ms)
    return utcDate
  }
}
