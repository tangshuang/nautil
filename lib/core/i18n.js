import i18next from 'i18next'
import { isArray } from './utils.js'

export class I18n {
  constructor(options) {
    this.i18next = i18next.createInstance()
    this.init(options)
  }
  init(options) {
    return this.i18next.init(options)
  }
  changeLanguage(lang) {
    return this.i18next.changeLanguage(lang)
  }
  language(lang) {
    return lang ? this.changeLanguage(lang) : this.i18next.language
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

  t(key, params) {
    return this.i18next.t(key, params)
  }
  number(num, options) {
    return new Intl.NumberFormat(this.language(), options).format(num)
  }
  date(date, options) {
    return new Intl.DateTimeFormat(this.language(), options).format(new Date(date))
  }
  currency(num, currency, options = {}) {
    return new Intl.NumberFormat(this.language(), { ...options, style: 'currency', currency }).format(num)
  }
}
export default I18n
