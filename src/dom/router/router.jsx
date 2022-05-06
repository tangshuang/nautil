import { mixin } from 'ts-fns'
import { Router } from '../../lib/router/router.jsx'
import { History } from '../../lib/router/history.js'
import { revokeUrl, parseSearch } from '../../lib/utils.js'

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
  actionType = '';
  latestState = window.history.state;

  get location() {
    const { href, pathname, search, hash } = window.location
    const query = parseSearch(search)
    return { href, pathname, search, query, hash }
  }

  init() {
    const onUrlChanged = (e) => {
      this.actionType = e.type;
      const currentState = this.latestState;
      this.latestState = window.history.state;
      const nextState = this.latestState;

      if (e.type === 'popstate') {
        if (currentState?.prev === nextState) {
          this.actionType = 'back';
        }
        else if (currentState?.next === nextState) {
          this.actionType = 'forward';
        }
      }

      this.emit('change', window.location.href);
    };

    const onBeforeUnload = (e) => {
      if (this.hasEvent('proect')) {
        let prevented = false
        const resolve = () => void 0
        const reject = () => prevented = true

        this.emit('protect', resolve, reject)

        if (prevented) {
          e.preventDefault()
        }
      }
    }

    window.addEventListener('popstate', onUrlChanged)
    window.addEventListener('replaceState', onUrlChanged)
    window.addEventListener('pushState', onUrlChanged)
    window.addEventListener('beforeunload', onBeforeUnload)

    return () => {
      window.removeEventListener('popstate', onUrlChanged)
      window.removeEventListener('replaceState', onUrlChanged)
      window.removeEventListener('pushState', onUrlChanged)
      window.removeEventListener('beforeunload', onBeforeUnload)
    };
  }
  back() {
    window.history.back();
  }
  forward() {
    window.history.forward();
  }
  push(url) {
    if (window.location.href === url) {
      return;
    }
    const { state } = window.history;
    const next = { prev: state, url };
    window.history.pushState(next, null, url);
  }
  replace(url) {
    if (window.location.href === url) {
      return;
    }
    const { state } = window.history;
    const prev = state?.prev?.state;
    const next = { prev, url };
    window.history.replaceState(next, null, url);
  }

  $parseUrl(url, abs, mode) {
    const { type, query, base } = mode;

    const root = base && base !== '/' ? base + abs : abs;
    const { pathname, search, hash } = new URL(url);

    const create = (path) => revokeUrl(root, path);

    if (type === 'hash') {
      const url = hash ? hash.substring(1) : '/';
      return create(url);
    }

    if (type === 'hash_search') {
      const { hash } = location;
      const index = hash.indexOf('?');
      const search = index > -1 ? hash.substring(index) : '';
      const found = search.match(new RegExp(`[&?]${query}=(.*?)(&|$)`));
      const url = found ? decodeURIComponent(found[1]) : '/';
      return create(url);
    }

    if (type === 'search') {
      const { search } = location;
      const found = search.match(new RegExp(`[&?]${query}=(.*?)(&|$)`));
      const url = found ? decodeURIComponent(found[1]) : '/';
      return create(url);
    }

    const path = pathname + search;
    return create(path);
  }

  $makeUrl(to, abs, mode, params) {
    const { type, query } = mode

    const url = this.$discernUrl(to, abs, mode, params)
    const encoded = encodeURIComponent(url)

    const { hash, search, pathname } = location

    if (type === 'hash') {
      return pathname + search + '#' + url
    }

    if (type === 'hash_search') {
      const reg = new RegExp('(&|\\?)' + query + '=(.*?)(&|$)')
      const hasSearch = hash.indexOf('?') > 0
      if (hasSearch) {
        const found = hash.match(reg)
        if (found) {
          return pathname + search + hash.replace(reg, `$1${query}=${encoded}$3`)
        }
        return pathname + search + hash + `&${query}=${encoded}`
      }
      if (hash) {
        return pathname + search + hash + `?${query}=${encoded}`
      }
      return pathname + search + `#?${query}=${encoded}`
    }

    if (type === 'search') {
      const reg = new RegExp('(&|\\?)' + query + '=(.*?)(&|$)')
      const found = search.match(reg)
      if (found) {
        return pathname + search.replace(reg, `$1${query}=${encoded}$3`) + hash
      }
      if (search) {
        return pathname + search + `&${query}=${encoded}` + hash
      }
      return pathname + `?${query}=${encoded}` + hash
    }

    return url
  }
}

History.implement('history', BrowserHistory)
History.implement('hash', BrowserHistory)
History.implement('search', BrowserHistory)
History.implement('hash_search', BrowserHistory)

mixin(Router, class {
  static $createLink(data) {
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
