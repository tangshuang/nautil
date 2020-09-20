import ReactDOM from 'react-dom'
import { isFunction } from 'ts-fns'

export { unmount, update, mount } from '../dom/index.js'

export async function hydrate(el, Component, props = {}, options = {}) {
  const {
    navigations = [],
    i18ns = [],
    onHydrate,
  } = options

  // set url into navigation
  const url = window.__hydrate_data.url
  navigations.forEach((navigation) => {
    if (navigation.options.mode === 'history') {
      navigation.setUrl(url)
    }
  })

  // set language
  const lang = window.__hydrate_data.language
  if (lang) {
    i18ns.forEach((i18n) => {
      i18n.setLang(lang)
      i18n.on('languageChanged', (lng) => window.fetch(url + (url.indexOf('?') > 0 ? '&' : '?') + 'lng=' + lng))
    })
  }

  // call before render
  if (isFunction(onHydrate)) {
    await onHydrate.call(window.__hydrate_data)
  }

  // query selector
  if (typeof el === 'string') {
    el = document.querySelector(el)
  }

  // use hydrate
  return ReactDOM.hydrate(<Component {...props} />, el)
}
