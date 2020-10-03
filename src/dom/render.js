import ReactDOM from 'react-dom'
import React from 'react'

import Navigator from '../lib/navi/navigator.jsx'
import Provider from '../lib/store/provider.jsx'

import { nest } from '../lib/core/operators/operators.js'

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

export function createApp(options = {}) {
  const { navigation, store } = options
  const None = () => null

  const items = []
  const handlers = Object.keys(createApp._handlers || {})

  handlers.forEach(({ key, component }) => {
    const props = options[key]
    if (!props) {
      return
    }
    items.push([component, props])
  })

  items.push(
    store && [Provider, { store }],
    [Navigator, { navigation, inside: true }],
  )

  const Component = nest(...items)(None)

  return Component
}
createApp.register = function(key, component) {
  createApp._handlers = createApp._handlers || []
  createApp._handlers.push({ key, component })
}
