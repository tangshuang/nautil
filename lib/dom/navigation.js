import Navigation from '../core/navigation.js'
import { each } from '../core/utils.js'

Object.assign(Navigation.prototype, {
  init(options = {}) {
    const onLoaded = async (changeLocation = true) => {
      const { mode, defaultRoute } = this.options
      const { routes } = this

      if (['history', 'hash', 'search'].indexOf(mode) === -1) {
        const state = await this.storage.get('historyState')
        if (mode === 'storage' && state) {
          const { route, params } = state
          const { redirect } = route
          if (redirect) {
            this.go(redirect, params, true)
            return
          }
          this.push(state, changeLocation)
        }
        else if (defaultRoute) {
          const { defaultRoute } = this.options
          this.go(...(Array.isArray(defaultRoute) ? defaultRoute : [defaultRoute]))
        }
        else {
          const defaultRoute = routes[0]
          const { name, params = {} } = defaultRoute
          this.go(name, params)
        }

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
    const onUrlChanged = (e) => {
      const { mode } = this.options
      if (['history'].indexOf(mode) === -1) {
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
    }
    const onHashChanged = () => {
      const { mode } = this.options
      if (['hash', 'search'].indexOf(mode) === -1) {
        return
      }

      if (this._changingLoactionHash) {
        this._changingLoactionHash = false
      }
      else {
        onLoaded(false)
      }
    }

    this._changingLoactionHash = false // record whether is changing location hash

    window.addEventListener('load', onLoaded)
    window.addEventListener('hashchange', onHashChanged)
    window.addEventListener('popstate', onUrlChanged)
  },

  open(url, params) {
    each(params, (value, key) => {
      url = url.replace(new RegExp(':' + key + '[(?=\\\/)|$]', 'g'), value)
    })
    window.open(url, '_blank')
  },

  parseLoactionToUrl() {
    const location = window.location
    const { mode, base = '/', searchQuery = '_url' } = this.options
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
    else if (mode === 'hash') {
      const url = location.hash ? location.hash.substr(1) : '/'
      return url
    }
    else if (mode === 'search') {
      const hash = location.hash
      const search = hash.indexOf('?') > -1 ? hash.split('?').pop() : ''
      const found = search.match(new RegExp(searchQuery + '=(.*?)(\&|$)'))
      const url = found ? decodeURIComponent(found[1]) : '/'
      return url
    }
    else {
      return ''
    }
  },

  async changeLocation(state, replace = false) {
    const { url, params, name } = state
    const { mode, base = '/', searchQuery = '_url' } = this.options

    // if (mode === 'history' || mode === 'hash') {
    //   const currentHref = window.location.href
    //   const currentState = this.parseUrlToState(currentHref)
    //   if (currentState && currentState.url === url) {
    //     return
    //   }
    // }

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
      window.location.hash = '#' + url
      this._changingLoactionHash = true
    }
    else if (mode === 'search') {
      const encoded = encodeURIComponent(url)
      const hash = location.hash
      if (!hash) {
        window.location.hash = '#?' + searchQuery + '=' + encoded
      }
      else if (hash.indexOf('?') === -1) {
        window.location.hash = hash + '?' + searchQuery + '=' + encoded
      }
      else {
        const search = hash.split('?').pop()
        if (search.indexOf(searchQuery + '=') === -1) {
          window.location.hash = hash + '&' + searchQuery + '=' + encoded
        }
        else {
          const replaced = hash.replace(new RegExp(searchQuery + '=(.*?)(\&|$)'), searchQuery + '=' + encoded)
          window.location.hash = replaced
        }
      }
      this._changingLoactionHash = true
    }
    else {
      await this.storage.set('historyState', state)
    }
  },
})
