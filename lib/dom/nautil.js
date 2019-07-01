import ReactDOM from 'react-dom'
import { isInstanceOf } from '../core/utils.js'

export function mount(el, component) {
  if (typeof el === 'string') {
    el = document.querySelector(el)
  }

  if (!isInstanceOf(el, HTMLElement)) {
    throw new Error('you should must mount your component to a HTMLElement')
  }

  return ReactDOM.render(el, component)
}

export function unmount(el) {
  if (typeof el === 'string') {
    el = document.querySelector(el)
  }

  if (!isInstanceOf(el, HTMLElement)) {
    throw new Error('you should must unmount your component from a HTMLElement')
  }

  return ReactDOM.unmountComponentAtNode(el)
}
