import './style.js'
import './navigation.js'
import './storage.js'
import './components.js'

import ReactDOM from 'react-dom'

export function mount(el, Component, props = {}) {
  if (typeof el === 'string') {
    el = document.querySelector(el)
  }

  return ReactDOM.render(<Component {...props} />, el)
}

export function unmount(el) {
  if (typeof el === 'string') {
    el = document.querySelector(el)
  }

  return ReactDOM.unmountComponentAtNode(el)
}

export function update(...args) {
  return mount(...args)
}
