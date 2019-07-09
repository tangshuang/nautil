import App from '../core/app.js'
import { mount, unmount } from './nautil.js'

Object.assign(App.prototype, {
  start() {
    if (this._running) {
      return this
    }

    const { el } =  this.options
    const Component = this.create()

    mount(el, Component)
    return this
  },
  stop() {
    if (!this._running) {
      return this
    }

    const { el } = this.options

    unmount(el)
    return this
  },
})

export { App }
export default App
