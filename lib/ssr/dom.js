import './navigation.js'
import './depository.js'

import '../dom/style.js'
import '../dom/navigation.js'
import '../dom/storage.js'
import '../dom/components.js'

import ReactDOM from 'react-dom'
import { isFunction } from '../core/utils.js'

export { unmount, update, mount } from '../dom/index.js'

export function hydrate(el, Component, props = {}, options = {}) {
  const {
    navigations = [],
    depositories = [],
    onHydrate,
  } = options

  // set url into navigation
  const url = window.location.pathname
  navigations.forEach((navigation) => {
    if (navigation.options.mode === 'history') {
      navigation.setUrl(url)
    }
  })

  // clear data, so that all depositories are clean
  depositories.forEach((depo) => {
    depo.setConfig()
  })

  // call before render
  if (isFunction(onHydrate)) {
    onHydrate.call(window.__hydrate_data)
  }

  if (typeof el === 'string') {
    el = document.querySelector(el)
  }

  // use hydrate
  return ReactDOM.hydrate(<Component {...props} />, el)
}
