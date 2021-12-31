import { mixin } from 'ts-fns'
import { Router } from '../../lib/router/router.jsx'
import { History } from '../../lib/router/history.js'
import { revokeUrl, resolveUrl } from '../../lib/utils.js'

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

class BrowserHistory extends History {
  get location() {
    const { href, pathname, search, hash } = window.location
    const query = parseSearch(search)
    return { href, pathname, search, query, hash }
  }
  init() {
    const onUrlChanged = () => this.dispatch(window.location.href)

    window.addEventListener('popstate', onUrlChanged)
    window.addEventListener('replaceState', onUrlChanged)
    window.addEventListener('pushState', onUrlChanged)

    return () => {
      window.removeEventListener('popstate', onUrlChanged)
      window.removeEventListener('replaceState', onUrlChanged)
      window.removeEventListener('pushState', onUrlChanged)
    }
  }
  back() {
    window.history.back()
  }
  forward() {
    window.history.forward()
  }
  push(url) {
    window.history.pushState(null, null, url)
  }
  replace() {
    window.history.replaceState(null, null, url)
  }
  $getUrl(abs, mode) {
    const { type, query, base } = mode

    const root = base && base !== '/' ? base + abs : abs
    const { pathname, search, hash } = window.location

    const create = (path) => {
      return revokeUrl(root, path)
    }

    if (type === 'hash') {
      const url = hash ? hash.substring(1) : '/'
      return create(url)
    }

    if (type === 'hash_search') {
      const { hash } = location
      const index = hash.indexOf('?')
      const search = index > -1 ? hash.substring(index) : ''
      const found = search.match(new RegExp('[\&\?]' + query + '=(.*?)(\&|$)'))
      const url = found ? decodeURIComponent(found[1]) : '/'
      return create(url)
    }

    if (type === 'search') {
      const { search } = location
      const found = search.match(new RegExp('[\&\?]' + query + '=(.*?)(\&|$)'))
      const url = found ? decodeURIComponent(found[1]) : '/'
      return create(url)
    }

    const path = pathname + search
    return create(path)
  }
  $makeUrl(to, abs, mode) {
    const { type, query, base } = mode
    const url = resolveUrl(base, resolveUrl(abs, to))
    const encoded = encodeURIComponent(url)

    const { hash, search, pathname } = location

    if (type === 'hash') {
      return pathname + search + '#' + url
    }

    if (type === 'hash_search') {
      const hasSearch = hash.indexOf('?') > 0
      if (hasSearch) {
        const found = hash.match(new RegExp('(\&|\?)' + query + '=(.*?)(\&|$)'))
        if (found) {
          return pathname + search + hash.replace(new RegExp('(\&|\?)' + query + '=(.*?)(\&|$)'), `$1${query}=${encoded}$3`)
        }
        return pathname + search + hash + `&${query}=${encoded}`
      }
      if (hash) {
        return pathname + search + hash + `?${query}=${encoded}`
      }
      return pathname + search `#?${query}=${encoded}`
    }

    if (type === 'search') {
      const encoded = encodeURIComponent(url)
      const found = search.match(new RegExp('(\&|\?)' + query + '=(.*?)(\&|$)'))
      if (found) {
        return pathname + search.replace(new RegExp('(\&|\?)' + query + '=(.*?)(\&|$)'), `$1${query}=${encoded}$3`) + hash
      }
      if (search) {
        return pathname + search + `&${query}=${encoded}` + hash
      }
      return pathname + `?${query}=${encoded}` + hash
    }

    return url
  }
  $setUrl(to, abs, mode, replace) {
    const url = this.$makeUrl(to, abs, mode)
    this.history[replace ? 'replace' : 'push'](url)
  }
}

History.implement('history', BrowserHistory)
History.implement('hash', BrowserHistory)
History.implement('search', BrowserHistory)
History.implement('hash_search', BrowserHistory)

mixin(Router, class {
  $createLink(data) {
    const { children, href, open, navigate, ...attrs } = data
    const handleClick = (e) => {
      e.preventDefault()
      if (open) {
        window.open(href)
      }
      else {
        navigate()
      }
    }
    if (open) {
      attrs.target = '_blank'
    }
    return (
      <a {...attrs} href={href} onClick={handleClick}>{children}</a>
    )
  }
})

export { Router }