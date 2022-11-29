import { mixin } from 'ts-fns'
import { Router } from '../../lib/router/router.jsx'
import { History } from '../../lib/router/history.js'
import { revokeUrl, parseSearch } from '../../lib/utils.js'
import { useState, useEffect } from 'react'

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
  actionType = ''
  latestState = window.history.state

  get location() {
    const { href, pathname, search, hash } = window.location
    const query = parseSearch(search)
    return { href, pathname, search, query, hash }
  }

  init() {
    const onUrlChanged = (e) => {
      this.actionType = e.type
      const currentState = this.latestState
      this.latestState = window.history.state
      const nextState = this.latestState

      if (e.type === 'popstate') {
        if (currentState?.prev === nextState) {
          this.actionType = 'back'
        }
        else if (currentState?.next === nextState) {
          this.actionType = 'forward'
        }
      }

      this.emit('change', window.location.href)
    }

    const onBeforeUnload = (e) => {
      if (this.hasEvent('protect')) {
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
    }
  }
  back() {
    window.history.back()
  }
  forward() {
    window.history.forward()
  }
  push(url) {
    const { href, origin } = window.location
    const path = href.replace(origin, '')
    const { state } = window.history

    if (href === url || path === url || (state && state?.url === url)) {
      return
    }

    const next = { prev: state, url }
    window.history.pushState(next, null, url)
  }
  replace(url) {
    if (window.location.href === url) {
      return
    }
    const { state } = window.history
    const prev = state?.prev?.state
    const next = { prev, url }
    window.history.replaceState(next, null, url)
  }
  open(url) {
    window.open(url)
  }

  $parseUrl(url, abs, mode) {
    const { type, query, base } = mode

    const root = base && base !== '/' ? base + abs : abs
    const { pathname, search, hash } = new URL(url)

    const create = (path) => revokeUrl(root, path)

    if (type === 'hash') {
      const url = hash ? hash.substring(1) : '/'
      return create(url)
    }

    if (type === 'hash_search') {
      const { hash } = location
      const index = hash.indexOf('?')
      const search = index > -1 ? hash.substring(index) : ''
      const found = search.match(new RegExp(`[&?]${query}=(.*?)(&|$)`))
      const url = found ? decodeURIComponent(found[1]) : '/'
      return create(url)
    }

    if (type === 'search') {
      const { search } = location
      const found = search.match(new RegExp(`[&?]${query}=(.*?)(&|$)`))
      const url = found ? decodeURIComponent(found[1]) : '/'
      return create(url)
    }

    const path = pathname + search
    return create(path)
  }

  makeUrl(to, abs, mode, params) {
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

  init() {
    this.stack = []
  }

  render(component, props, { url, history }) {
    if (this.options.transition === 'stack') {
      return this.renderStack(component, props, { url, history })
    }

    // without transition
    const C = component
    return <C {...props} />
  }

  renderStack(component, props, { url, history }) {
    let action = 'none'
    let bottom = component
    let cover = null

    if (this.stack.length) {
      const index = this.stack.findIndex((item) => item.component === component && item.url === url)
      // if not in stack, use history.actionType to determine user's operation type,
      // if use click back button, act as like pop transition (event though we insert the view)
      if (index === -1 && history.actionType === 'back') {
        bottom = component
        cover = this.stack[this.stack.length - 1].component
        this.stack = [{ component, url }] // reset stack directly
        action = 'pop'
      }
      // not in stack, act as entering transition
      else if (index === -1) {
        bottom = this.stack[this.stack.length - 1].component
        cover = component
        this.stack.push({ component, url })
        action = 'push'
      }
      // in stack, act as exiting transition
      else if (index < this.stack.length - 1) {
        bottom = component
        cover = this.stack[this.stack.length - 1].component
        this.stack.length = index + 1
        action = 'pop'
      }
    }
    // stack is empty, means enter first time, show the view directly
    else {
      this.stack.push({ component, url })
    }

    return <StackTransition bottom={bottom} cover={cover} action={action} props={props} />
  }
})

const styleSheet = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  view: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    transition: 'opacity .2s, transform .2s',
  },
  cover: {
    zIndex: 2,
  },
  hidden: {
    opacity: 0,
    transform: 'translateX(100%)',
  },
  shown: {
    opacity: 1,
    transform: 'translateX(0%)',
  },
}

function StackTransition(props) {
  const { bottom: B, cover, props: attrs, action } = props

  return (
    <div style={styleSheet.container}>
      <div style={styleSheet.view}>
        <B {...attrs} />
      </div>
      {action !== 'none' && cover ? (
        <StackTransitionCover key={cover} component={cover} action={action} props={attrs} />
      ) : null}
    </div>
  )
}

const initClass = {
  push: styleSheet.hidden,
  pop: styleSheet.shown,
}

const finishClass = {
  push: styleSheet.shown,
  pop: styleSheet.hidden,
}

function StackTransitionCover(props) {
  const { component: C, action, props: attrs } = props
  const [state, setState] = useState(initClass[action])

  useEffect(() => {
    setTimeout(() => {
      setState(finishClass[action])
    }, 64)
  }, [action])

  return (
    <div style={{
      ...styleSheet.view,
      ...styleSheet.cover,
      ...state,
    }}>
      <C {...attrs} />
    </div>
  )
}

export { Router }
