import Navigation from '../core/navigation.js'
import { each } from '../core/utils.js'

export class BrowserNavigation extends Navigation {
  init(options) {
    const onLoaded = (changeLocation = true) => {
      const url = this.parseLoactionToUrl()
      const state = this.parseUrlToState(url)
      if (state) {
        const { route, params } = state
        const { redirect } = route
        if (redirect) {
          this.go(redirect, params, true)
          return
        }
        this.push(state, changeLocation)
      }
      else {
        this._onNotFound()
      }
    }
    const onHashChanged = () => {
      onLoaded(false)
    }
    const onUrlChanged = (e) => {
      const _state = e.state
      if (_state) {
        const { name, params } = _state
        const state = this.makeState(name, params)
        const { route } = state
        const { redirect } = route
        if (redirect) {
          this.go(redirect, params, true)
          return
        }
        this.push(state, false)
      }
      else {
        onLoaded(false)
      }
    }
    window.addEventListener('load', onLoaded)
    window.addEventListener('hashchange', onHashChanged)
    window.addEventListener('popstate', onUrlChanged)
  }

  open(url, params) {
    each(params, (value, key) => {
      url = url.replace(new RegExp(':' + key + '[(?=\\\/)|$]', 'g'), value)
    })
    window.location.href = url
  }

  parseLoactionToUrl() {
    const location = window.location
    const { mode, base } = this.options
    if (mode === 'history') {
      const pathname = location.pathname
      if (pathname.indexOf(base) === 0) {
        const url = base !== '/' ? (pathname.replace(base, '') || '/') : pathname
        return url
      }
      else {
        return ''
      }
    }
    else {
      const url = location.hash ? location.hash.substr(1) : '/'
      return url
    }
  }

  changeLocation(state, replace = false) {
    const { url, params, name } = state
    const { mode, base } = this.options

    const currentHref = window.location.href
    const currentState = this.parseUrlToState(currentHref)
    if (currentState && currentState.url === url) {
      return
    }

    if (mode === 'history') {
      const target = base ? (base + url).replace('//', '/') : url
      if (replace) {
        window.history.replaceState({ name, params }, name, target)
      }
      else {
        window.history.pushState({ name, params }, name, target)
      }
    }
    else {
      window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + url
    }
  }
}

export default BrowserNavigation
