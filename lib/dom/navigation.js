import Navigation from '../core/navigation.js'
import { each } from '../core/utils.js'

Object.assign(Navigation.prototype, {
  init(options) {
    this.options = options
    this.routes = options.routes

    this.status = ''
    this.state = {}

    this._listeners = []
    this._history = []
    this._changing = false

    const onUrlChanged = () => {
      if (this._changing) {
        return
      }

      const state = this.parseUrlToState(window.location.href)
      if (state) {
        const { route, params } = state
        const { redirect } = route
        if (redirect) {
          this.go(redirect, params, true)
          return
        }
      }
      this.push(state)
    }
    const onLoaded = () => {
      const state = this.parseUrlToState(window.location.href)
      this.push(state)
    }
    window.addEventListener('hashchange', onUrlChanged)
    window.addEventListener('popstate', onUrlChanged)
    window.addEventListener('load', onLoaded)
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
  },
  off(match, callback) {
    this._listeners.forEach((item, i) => {
      if (item.match === match && (callback === undefined || item.callback === callback)) {
        this._listeners.splice(i, 1)
      }
    })
  },
  _dispatch(state) {
    const dispatchAnyWay = () => {
      const callbacks = items.filter(item => item.match === '*')
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
    this.status = ''
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

  back(count = 1) {
    const len = this._history.length
    const point = len - count - 1
    this._history.splice(point, count)

    const latest = this._history.pop()
    this.push(latest)
  },

  push(state) {
    if (!state) {
      this._onNotFound()
      return
    }

    this._onLeave()

    this._changing = true
    this.state = state
    this._history.push(state)
    this.changeUrl(state)
    this._changing = false

    this._onEnter()
    this.status = state.name
    this._dispatch(state)
  },
  replace(state) {
    if (!state) {
      this._onNotFound()
      return
    }

    this._onLeave()

    this._changing = true
    this.state = state
    this._history.pop()
    this._history.push(state)
    this.changeUrl(state, true)
    this._changing = false

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

    let routeParams = route.params || {}
    let combineParams = { ...routeParams, params }

    let { path } = route
    let keys = Object.keys(combineParams)
    let url = path
    keys.forEach((key) => {
      url = url.replace(new RegExp(':' + key + '[(?=\\\/)|$]', 'g'), params[key])
    })

    return {
      name,
      params,
      url,
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
    const parseUrl = (url) => {
      const a = new URL(url)
      const path = a.pathname.replace(/^([^\/])/, '/$1')
      return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: parseSearch(a.search),
        hash: a.hash.replace('#', ''),
        path,
        uri: path + (a.search ? '?' + a.search : '')
      }
    }

    const { mode, base } = this.options
    const { hash, uri } = parseUrl(url)

    const params = {}

    if (mode === 'history') {
      let [prefix, path] = uri.replace(base, '')
      url = path
    }
    else {
      url = hash
    }

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

        if (atTail && block.chartAt(0) === ':' && block.chartAt(block.length - 1) === '?') {
          optional.unshift(block)
        }
        else {
          atTail = false
          required.push(block)
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
        if (block.chartAt(0) !== ':' && routeBlock !== targetBlock) {
          return false
        }

        if (block.chartAt(0) === ':') {
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
    // const diffSearch = (src, target) => {
    //   const srcKeys = Object.keys(src)
    //   const targetKeys = Object.keys(target)
    //   if (srcKeys.length > targetKeys.length) {
    //     return false
    //   }
    //   for (let i = 0, len = srcKeys.length; i < len; i ++) {
    //     const key = srcKeys[i]
    //     if (target[key] === undefined) {
    //       return false
    //     }
    //     const srcValue = src[key]
    //     const targetValue = target[key]
    //     if (srcValue.indexOf(':') !== 0 && srcValue !== targetValue) {
    //       return false
    //     }

    //     if (srcValue.indexOf(':') === 0) {
    //       params[srcValue.substring(1)] = targetValue
    //     }
    //   }
    //   return true
    // }

    const targetInfo = parseUrl(url)
    const routes = this.routes

    let route
    for (let i = 0, len = routes.length; i < len; i ++) {
      let item = routes[i]
      let { path } =  item

      // completely same
      if (path === url) {
        route = item
        break
      }

      let routePathInfo = parseUrl(path)
      let targetBlocks = targetInfo.path.split('/')
      let routePathBlocks = routePathInfo.path.split('/')

      // if (diffBlocks(pathBlocks, infoBlocks) && diffSearch(pathinfo.params, info.params)) {
      if (diffBlocks(routePathBlocks, targetBlocks)) {
        route = item
        break
      }
    }

    if (!route) {
      return
    }

    const routeParams = route.params || {}
    const combineParams = { ...routeParams, ...params }

    return {
      name: route.name,
      params: combineParams,
      url,
      route,
    }
  },

  /**
   * @param {*} state
   */
  changeUrl(state, replace = false) {
    const { url } = state
    const { mode, base } = this.options

    // const currentHref = window.location.href
    // const currentState = this.parseUrlToState(currentHref)
    // const currentUrl = currentState.url

    // if (currentUrl === url) {
    //   return
    // }

    if (mode === 'history') {
      const target = base ? base + url : url
      if (replace) {
        window.history.replaceState(null, null, target)
      }
      else {
        window.history.pushState(null, null, target)
      }
    }
    else {
      window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + url
    }
  },
})