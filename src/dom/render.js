import ReactDOM from 'react-dom'
import React from 'react'

export function mount(el, Component, props = {}) {
  if (typeof el === 'string') {
    el = document.querySelector(el)
  }

  return ReactDOM.render(React.createElement(Component, props), el)
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
