import i18next from 'i18next'

import { isArray, isObject } from '../core/utils.js'

export class I18n {
  constructor(options) {
    this.options = options
    this.init(options)
  }
  init(options = {}) {
    const { use, ...settings } = options

    this.i18next = i18next.createInstance()

    if (isArray(use)) {
      use.forEach(item => this.i18next.use(item))
    }
    else if (isObject(use)) {
      this.i18next.use(use)
    }

    this.i18next.init(settings)
  }
  setLang(lang) {
    return this.i18next.changeLanguage(lang)
  }
  getLang() {
    return this.i18next.language
  }
  on(key, fn) {
    if (isArray(key)) {
      const keys = key
      keys.forEach(key => this.on(key, fn))
      return this
    }

    this.i18next.on(key, fn)
    return this
  }
  off(key, fn) {
    if (isArray(key)) {
      const keys = key
      keys.forEach(key => this.off(key, fn))
      return this
    }

    this.i18next.off(key, fn)
    return this
  }

  has(key, params) {
    return this.i18next.exists(key, params)
  }
  t(key, params) {
    return this.i18next.t(key, params)
  }

  text(key, params) {
    return this.t(key, params)
  }
  number(num, options) {
    return new Intl.NumberFormat(this.getLang(), options).format(num)
  }
  date(date, options) {
    return new Intl.DateTimeFormat(this.getLang(), options).format(new Date(date))
  }
  currency(num, currency, options = {}) {
    return new Intl.NumberFormat(this.getLang(), { ...options, style: 'currency', currency }).format(num)
  }
}
export default I18n
