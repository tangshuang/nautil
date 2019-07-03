import i18next from 'i18next'

export class I18n {
  constructor(options) {
    this.i18next = i18next.createInstance()
    this.init(options)
  }
  init(options) {
    return this.i18next.init(options)
  }
  currentLanguage(lang) {
    return lang ? this.i18next.changeLanguage(lang) : this.i18next.language
  }
  on(key, fn) {
    this.i18next.on(key, fn)
    return this
  }
  off(key, fn) {
    this.i18next.off(key, fn)
    return this
  }

  t(key, params) {
    return this.i18next.t(key, params)
  }
  number(num, options) {
    return new Intl.NumberFormat(this.currentLanguage(), options).format(num)
  }
  date(date, options) {
    return new Intl.DateTimeFormat(this.currentLanguage(), options).format(new Date(date))
  }
  currency(num, currency, options = {}) {
    return new Intl.NumberFormat(this.currentLanguage(), { ...options, style: 'currency', currency }).format(num)
  }
}
