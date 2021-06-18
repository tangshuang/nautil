import { mixin } from 'ts-fns'
import Navigation from '../../lib/navi/navigation.js'
import Storage from '../../lib/storage/storage.js'

const init = Navigation.prototype.init
function rewriteHistory(type) {
  const origin = window.history[type]
  return function() {
    const rv = origin.apply(this, arguments)
    const e = new Event(type)
    e.arguments = arguments
    window.dispatchEvent(e)
    return rv
  }
}
window.history.pushState = rewriteHistory('pushState')
window.history.replaceState = rewriteHistory('replaceState')

mixin(Navigation, class {
  init() {
    const onLoaded = async (changeLocation = true) => {
      const { mode } = this._getMode()

      // don't use browser url
      if (['history', 'hash', 'search', 'hash_search'].indexOf(mode) === -1) {
        init.call(this)
        return
      }

      // use browser url
      const url = this.parseLoactionToUrl()
      const state = this.$parseUrlToState(url)

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
      else if (!changeLocation) {
        this._goDefaultRoute()
      }
      else {
        this._onNotFound()
      }
    }
    const onUrlChanged = (e) => {
      const { mode } = this.options
      if (['history', 'search'].indexOf(mode) === -1) {
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
      if (['hash', 'hash_search'].indexOf(mode) === -1) {
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

    onLoaded(false)
    window.addEventListener('hashchange', onHashChanged)
    window.addEventListener('popstate', onUrlChanged)
    window.addEventListener('replaceState', onUrlChanged)
    window.addEventListener('pushState', onUrlChanged)
  }

  open(to, params) {
    const url = this.makeUrl(to, params)
    window.open(url, '_blank')
  }

  parseLoactionToUrl() {
    const location = window.location
    const { mode, query } = this._getMode()
    if (mode === 'history') {
      const { pathname, search } = location
      return pathname + search
    }
    else if (mode === 'hash') {
      const url = location.hash ? location.hash.substr(1) : '/'
      return url
    }
    else if (mode === 'hash_search') {
      const hash = location.hash
      const search = hash.indexOf('?') > -1 ? hash.split('?').pop() : ''
      const found = search.match(new RegExp(query + '=(.*?)(\&|$)'))
      const url = found ? decodeURIComponent(found[1]) : '/'
      return url
    }
    else if (mode === 'search') {
      const search = location.search
      const found = search.match(new RegExp(query + '=(.*?)(\&|$)'))
      const url = found ? decodeURIComponent(found[1]) : '/'
      return url
    }
    else {
      return ''
    }
  }

  async changeLocation(nextState, replace = false) {
    const href = this.$makeHref(nextState)

    const { params, name } = nextState
    const { mode } = this._getMode()

    if (mode === 'history' || mode === 'search') {
      if (replace) {
        window.history.replaceState({ name, params }, name, href)
      }
      else {
        window.history.pushState({ name, params }, name, href)
      }
    }
    else if (mode === 'hash' || mode === 'hash_search') {
      window.location.hash = href
      this._changingLoactionHash = true
    }
    else if (mode === 'storage') {
      await Storage.setItem('historyState', nextState)
    }
  }

  $makeHref(state) {
    if (!state) {
      return '#!'
    }

    const currentUrl = window.location.href
    const { path } = state
    const { mode, query, base } = this._getMode()

    if (mode === 'hash') {
      const href = '#' + base + path
      return href
    }
    else if (mode === 'search') {
      const currentSearch = currentUrl.indexOf('?') > -1 ? currentUrl.split('?') : ''
      const encoded = encodeURIComponent(base + path)

      if (!currentSearch) {
        const href = '?' + query + '=' + encoded
        return href
      }
      else {
        const href = '?' + currentSearch.replace(new RegExp(query + '=(.*?)(\&|$)'), query + '=' + encoded + '$2')
        return href
      }
    }
    else if (mode === 'hash_search') {
      const currentHash = currentUrl.indexOf('#') > -1 ? currentUrl.split('#').pop() : ''
      const encoded = encodeURIComponent(base + path)

      if (!currentHash) {
        const href = '#?' + query + '=' + encoded
        return href
      }
      else if (currentHash.indexOf('?') === -1) {
        const href = '#' + currentHash + '?' + query + '=' + encoded
        return href
      }
      else {
        const currentSearch = currentHash.split('?').pop()
        if (currentSearch.indexOf(query + '=') === -1) {
          const href = '#' + currentHash + '&' + query + '=' + encoded
          return href
        }
        else {
          const href = '#' + currentHash.replace(new RegExp(query + '=(.*?)(\&|$)'), query + '=' + encoded + '$2')
          return href
        }
      }
    }
    else {
      return base + path
    }
  }
})

export { Navigation }
export default Navigation
