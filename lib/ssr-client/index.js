import './polyfills.js'

import ReactDOM from 'react-dom'
import { isFunction } from '../core/utils.js'
import { asyncMap, awaitx } from 'asw'
import axios from 'axios'

export { unmount, update, mount } from '../dom/index.js'
export async function hydrate(el, Component, props = {}, options = {}) {
  const {
    navigations = [],
    depositories = [],
    stores = [],
    models = [],
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
      i18n.on('languageChanged', (lng) => axios.get(url + (url.indexOf('?') > 0 ? '&' : '?') + 'lng=' + lng))
    })
  }

  // clear data, so that all depositories are clean
  // and then set data into depo
  const depositoriesData = window.__depositories_data || []
  await asyncMap(depositories, async (depo, i) => {
    await awaitx(depo.store.clear())
    const data = depositoriesData[i] || {}
    const { key, value } = data
    await awaitx(depo.store.set(key, value))
  })

  // clear and reset store data
  const storesData = window.__stores_data || []
  stores.forEach((store, i) => {
    store.data = storesData[i] || {}
  })

  // clear and reset model data
  const modelsData = window.__models_data || []
  models.forEach((model) => {
    model.data = modelsData[i] || {}
  })

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
