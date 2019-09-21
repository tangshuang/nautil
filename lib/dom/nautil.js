import ReactDOM from 'react-dom'

export function mount(el, Component, props = {}) {
  if (typeof el === 'string') {
    el = document.querySelector(el)
  }

  return ReactDOM.render(<Component {...props}></Component>, el)
}

export function unmount(el) {
  if (typeof el === 'string') {
    el = document.querySelector(el)
  }

  return ReactDOM.unmountComponentAtNode(el)
}
