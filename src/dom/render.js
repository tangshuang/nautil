import ReactDOM from 'react-dom'
import { createElement } from 'react'

export function mount(el, Component, props = {}) {
  return render(el, createElement(Component, props))
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

export function render(el, vdom) {
  if (typeof el === 'string') {
    el = document.querySelector(el)
  }

  return ReactDOM.render(vdom, el)
}
