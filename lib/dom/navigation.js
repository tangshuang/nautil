import Navigation from '../core/navigation.js'
import { each, inObject } from '../core/utils.js'

Object.assign(Navigation.prototype, {
  init(options) {
    this.options = options
    this.routes = options.routes

    this.status = ''
    this.state = {}

    this._listeners = []
    this._history = []

    const onLoaded = (push = true) => {
      const url = this.parseLoactionToUrl()
      const state = this.parseUrlToState(url)
      if (state) {
        const { route, params } = state
        const { redirect } = route
        if (redirect) {
          this.go(redirect, params, true)
          return
        }
        this.push(state, push)
      }
      else {
        this._onNotFound()
      }
    }
    const onHashChanged = () => {
      onLoaded(false)
    }
    const onUrlChanged = (e) => {
      const state = e.state
      if (state) {
        const { route, params } = state
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
  },

  on(match, callback, priority = 10) {
    const items = this._listeners
    items.push({ match, callback, priority })
    items.sort((a, b) => {
      if (a.priority > b.priority) {
        return -1
      }
      else if (a.priority < b.priority) {
        return 1
      }
      else {
        return 0
      }
    })
    return this
  },
  off(match, callback) {
    this._listeners.forEach((item, i) => {
      if (item.match === match && (callback === undefined || item.callback === callback)) {
        this._listeners.splice(i, 1)
      }
    })
    return this
  },
  _dispatch(state) {
    const dispatchAnyWay = () => {
      const callbacks = this._listeners.filter(item => item.match === '*')
      callbacks.forEach(item => item.callback.call(this))
    }

    // not found
    if (!state) {
      const fallbacks = this._listeners.filter(item => item.match === '!')
      fallbacks.forEach(item => item.callback.call(this))
      dispatchAnyWay()
      return
    }

    const { name, url } = state
    const items = this._listeners.filter((item) => {
      const { match } = item
      if (match === '*') {
        return false
      }
      // i.e on('book', callback)
      if (match === name) {
        return true
      }
      // i.e. on(/iii/g, callback)
      if (match instanceof RegExp && match.test(url)) {
        return true
      }
      // i.e. on(url => url.indexOf('http') === 0, callback)
      if (typeof match === 'function' && match(state)) {
        return true
      }
      // i.e. on('/books/:bookId', callback)
      if (typeof match === 'string') {
        let info = this.parseUrlToState(match)
        if (info.name === name) {
          return true
        }
      }
      return false
    })

    if (!items.length) {
      dispatchAnyWay()
      return
    }

    items.forEach(item => item.callback.call(this, state))
    dispatchAnyWay()
  },

  _onLeave() {
    const state = this.state
    const { route } = state
    if (!route) {
      return
    }

    const { onLeave } = route
    if (!onLeave) {
      return
    }

    onLeave.call(this)
  },
  _onEnter() {
    const state = this.state
    const { route } = state
    if (!route) {
      return
    }

    const { onEnter } = route
    if (!onEnter) {
      return
    }

    onEnter.call(this)
  },
  _onNotFound() {
    this.status = '!'
    this._dispatch()
  },

  go(name, params = {}, replace = false) {
    let state = this.makeState(name, params)

    if (state) {
      let { route } = state
      let { redirect } = route
      if (redirect) {
        this.go(redirect, params, true)
        return
      }
    }

    if (replace) {
      this.replace(state)
    }
    else {
      this.push(state)
    }
  },

  open(url, params) {
    each(params, (value, key) => {
      url = url.replace(new RegExp(':' + key + '[(?=\\\/)|$]', 'g'), value)
    })
    window.location.href = url
  },

  back(count = -1) {
    const len = this._history.length
    const point = len + count
    this._history.splice(point, -count)

    if (this._history.length) {
      const latest = this._history.pop()
      this.push(latest)
    }
    else if (this.options.defaultIndex) {
      this.go(this.options.defaultIndex)
    }
  },

  push(state, changeLocation = true) {
    if (!state) {
      this._onNotFound()
      return
    }

    this._onLeave()

    this.state = state
    this._history.push(state)
    if (this.options.maxHistoryLength && this._history.length > this.options.maxHistoryLength) {
      this._history.shift()
    }
    if (changeLocation) {
      this.changeLocation(state)
    }

    this._onEnter()
    this.status = state.name
    this._dispatch(state)
  },
  replace(state, changeLocation = true) {
    if (!state) {
      this._onNotFound()
      return
    }

    this._onLeave()

    this.state = state
    this._history.pop()
    this._history.push(state)
    if (changeLocation) {
      this.changeLocation(state, true)
    }

    this._onEnter()
    this.status = state.name
    this._dispatch(state)
  },

  /**
   * @param {*} name
   * @param {*} params
   * @return {object} state
   */
  makeState(name, params) {
    const route = this.routes.find(item => item.name === name)
    if (!route) {
      return
    }

    const routeParams = route.params || {}
    const combineParams = { ...routeParams, ...params }

    const { path } = route
    const url = path.replace(new RegExp(':([a-zA-Z0-9]+)\\??([(?=\\\/)|$])', 'g'), (matched, key, tail) => {
      if (!inObject(key, combineParams)) {
        return tail === '/' ? 'undefined/' : ''
      }

      const value = combineParams[key]
      const text = value + (tail === '/' ? '/' : '')
      return text
    })
    const clearUrl = url.replace(/\/+$/, '') || '/'

    return {
      name,
      params: combineParams,
      url: clearUrl,
      route,
    }
  },

  /**
   * @return {object} state
   */
  parseUrlToState(url) {
    const parseSearch = (search) => {
      let params = {}
      let segs = search.replace(/^\?/, '').split('&')
      for (let i = 0, len = segs.length; i < len; i ++) {
        if (segs[i]) {
          let p = segs[i].split('=')
          params[p[0]] = p[1]
        }
      }
      return params
    }

    let uri = url
    let search = ''
    if (url.indexOf('?') > -1) {
      [uri, search] = url.split('?')
    }

    const params = {}
    const diffBlocks = (route, target) => {
      // if the given url is more than route needs, it does not match this route
      if (target.length > route.length) {
        return false
      }

      const optional = []
      const required = []

      // only the last blocks can be optional
      let atTail = true
      for (let i = route.length - 1; i >= 0; i --) {
        const block = route[i]

        if (atTail && block.charAt(0) === ':' && block.charAt(block.length - 1) === '?') {
          optional.unshift(block)
        }
        else {
          atTail = false
          required.unshift(block)
        }
      }

      // if the given url is less than required, it does not match this route
      if (target.length < required.length) {
        return false
      }

      let index = 0
      for (let i = 0, len = required.length; i < len; i ++) {
        const routeBlock = required[i]
        const targetBlock = target[i]

        // not equal at normal block
        if (routeBlock.charAt(0) !== ':' && routeBlock !== targetBlock) {
          return false
        }

        if (routeBlock.charAt(0) === ':') {
          const key = routeBlock.substr(1)
          params[key] = targetBlock
        }

        index = i
      }

      for (let i = 0, len = optional.length; i < len; i ++) {
        const current = index + 1 + i
        const routeBlock = optional[i]
        const targetBlock = target[current]

        const key = routeBlock.substr(1, routeBlock.length - 2)
        params[key] = targetBlock
      }

      return true
    }

    const routes = this.routes
    const uriBlocks = uri.split('/')

    let route
    for (let i = 0, len = routes.length; i < len; i ++) {
      const item = routes[i]
      const { path } =  item

      // completely same
      if (path === uri) {
        route = item
        break
      }

      const routePathBlocks = path.split('/')
      // if (diffBlocks(pathBlocks, infoBlocks) && diffSearch(pathinfo.params, info.params)) {
      if (diffBlocks(routePathBlocks, uriBlocks)) {
        route = item
        break
      }
    }

    if (!route) {
      return
    }

    const searchQuery = parseSearch(search)
    const routeParams = route.params || {}
    const combineParams = { ...routeParams, ...searchQuery, ...params }

    return {
      name: route.name,
      params: combineParams,
      url,
      route,
    }
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

  /**
   * @param {*} state
   */
  changeLocation(state, replace = false) {
    const { url, route } = state
    const { mode, base } = this.options
    const { name } = route

    // const currentHref = window.location.href
    // const currentState = this.parseUrlToState(currentHref)
    // const currentUrl = currentState.url

    // if (currentUrl === url) {
    //   return
    // }

    if (mode === 'history') {
      const target = base ? (base + url).replace('//', '/') : url
      if (replace) {
        window.history.replaceState(state, name, target)
      }
      else {
        window.history.pushState(state, name, target)
      }
    }
    else {
      window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + url
    }
  },
})
