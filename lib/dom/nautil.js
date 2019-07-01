import ReactDOM from 'react-dom'

export function render(el, component) {
  if (typeof el === 'string') {
    el = document.querySelector(el)
  }

  return ReactDOM.render(el, component)
}

export function unmount(el) {
  if (typeof el === 'string') {
    el = document.querySelector(el)
  }

  return ReactDOM.unmountComponentAtNode(el)
}
