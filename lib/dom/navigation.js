import Navigation from '../core/navigation.js'
import { each } from '../core/utils.js'
import StorageX from 'storagex'

Object.assign(Navigation.prototype, {
  init(options = {}) {
    const { mode, routes } = options

    this.storage = new StorageX({
      namespace: options.namespace || 'nautil',
      async: false,
      stringify: true,
      storage: sessionStorage,
    })

    const onLoaded = (changeLocation = true) => {
      if (mode !== 'history' && mode !== 'hash') {
        return
      }

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
      if (mode !== 'history' && mode !== 'hash') {
        return
      }

      onLoaded(false)
    }
    const onUrlChanged = (e) => {
      if (mode !== 'history' && mode !== 'hash') {
        return
      }

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

    if (mode !== 'history' && mode !== 'hash') {
      const state = this.storage.get('historyState')
      if (state) {
        const { route, name, params } = state
        const { redirect } = route
        if (redirect) {
          this.go(redirect, params, true)
          return
        }
        this.go(name, params)
      }
      else if (options.defaultRoute) {
        const { defaultRoute } = options
        this.go(...(Array.isArray(defaultRoute) ? defaultRoute : [defaultRoute]))
      }
      else {
        const defaultRoute = routes[0]
        const { name, params = {} } = defaultRoute
        this.go(name, params)
      }
    }
  },

  open(url, params) {
    each(params, (value, key) => {
      url = url.replace(new RegExp(':' + key + '[(?=\\\/)|$]', 'g'), value)
    })
    window.open(url, '_blank')
  },

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
  },

  changeLocation(state, replace = false) {
    const { url, route, params, name } = state
    const { mode, base } = this.options

    if (mode === 'history' || mode === 'hash') {
      const currentHref = window.location.href
      const currentState = this.parseUrlToState(currentHref)
      if (currentState && currentState.url === url) {
        return
      }
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
    else if (mode === 'hash') {
      window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + url
    }
    else {
      this.storage.set('historyState', state)
    }
  },
})
