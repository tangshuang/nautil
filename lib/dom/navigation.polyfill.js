import Navigation from '../core/navigation.js'
import { each, attachPrototype } from '../core/utils.js'

attachPrototype(Navigation, {
  init() {
    const onLoaded = async (changeLocation = true) => {
      const { mode } = this.options

      // don't use browser url
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
        else {
          this._goDefaultRoute()
        }

        return
      }

      // use browser url
      const url = this.parseLoactionToUrl()
      const state = this.parseUrlToState(url)

      if (state) {
        const { route, params } = state
        const { redirect } = route
        if (redirect) {
          this.go(redirect, params, true)
        }
        else {
          this.push(state, changeLocation)
        }
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

    // window.addEventListener('load', onLoaded)
    onLoaded()
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
      const { pathname, search } = location
      if (pathname.indexOf(base) === 0) {
        const url = (base !== '/' ? (pathname.replace(base, '') || '/') : pathname) + search
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

    if (mode === 'history') {
      const target = base === '/' ? url : base + url
      if (replace) {
        window.history.replaceState({ name, params }, name, target)
      }
      else {
        window.history.pushState({ name, params }, name, target)
      }
    }
    else if (mode === 'hash') {
      const target = url
      window.location.hash = '#' + target
      this._changingLoactionHash = true
    }
    else if (mode === 'search') {
      const target = url
      const encoded = encodeURIComponent(target)
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
