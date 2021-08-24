import { inObject, isArray, isString, isFunction, isObject } from 'ts-fns'
import Storage from '../storage/storage.js'

export class Navigation {
  constructor(options = {}) {
    this.options = { ...Navigation.defaultOptions, ...options }

    // flat all children into this.routes
    const routes = []
    const push = (current, parent) => {
      const { name, path, children } = current
      const route = parent ? {
        ...current,
        name: parent.name + '.' + name,
        path: parent.path + path,
        parent,
      } : current

      if (isArray(children)) {
        children.forEach((child) => {
          push(child, route)
        })
      }
      // put behind
      routes.push(route)
    }
    options.routes.forEach((route) => {
      push(route)
    })
    this.routes = routes

    this.status = -1
    this.state = {}

    this._listeners = []
    this._history = []

    this.init(options)
  }

  getState() {
    return this.status > 0 ? this.state : null
  }

  _getMode() {
    const { mode = '' } = this.options

    if (!mode) {
      return { mode: 'memo', query: '', base: '' }
    }

    if (mode.indexOf('/') === 0) {
      const base = mode === '/' ? '' : mode
      return { mode: 'history', query: '', base }
    }

    if (mode.indexOf('#?') === 0) {
      const [query, base = ''] = mode.substring(2).split('=')
      return { mode: 'hash_search', query, base }
    }

    if (mode.indexOf('#') === 0) {
      const base = mode.substring(1)
      return { mode: 'hash', query: '', base }
    }

    if (mode.indexOf('?') === 0) {
      const [query, base = ''] = mode.substring(1).split('=')
      return { mode: 'search', query, base }
    }

    return { mode: 'storage', query: '', base: '' }
  }

  _parseDefaultRoute(defaultRoute) {
    if (isArray(defaultRoute)) {
      const [name, params = {}] = defaultRoute
      return [name, params]
    }
    else if (isObject(defaultRoute)) {
      const { name, params = {} } = defaultRoute
      return [name, params]
    }
    else if (isString(defaultRoute)) {
      return [defaultRoute, {}]
    }
  }

  _goDefaultRoute() {
    const { defaultRoute } = this.options
    if (defaultRoute) {
      const parsed = this._parseDefaultRoute(defaultRoute)
      if (parsed) {
        this.go(...parsed)
      }
    }
    else {
      const { routes } = this
      const defaultRoute = routes[0]
      const { name, params = {} } = defaultRoute
      this.go(name, params)
    }
  }

  async init() {
    const { mode } = this._getMode()
    if (mode === 'storage') {
      const state = await Storage.getItem('historyState')
      if (state) {
        const { route, name, params } = state
        const { redirect } = route
        if (redirect) {
          this.go(redirect, params, true)
        }
        else {
          this.go(name, params)
        }
      }
      else {
        this._goDefaultRoute()
      }
    }
    else {
      this._goDefaultRoute()
    }
  }

  on(match, callback, exact = false) {
    if (isArray(match)) {
      const matches = match
      matches.forEach(match => this.on(match, callback, exact))
      return this
    }

    this._listeners.push({ match, callback, exact })
    return this
  }

  off(match, callback) {
    if (isArray(match)) {
      const matches = match
      matches.forEach(match => this.off(match, callback))
      return this
    }

    this._listeners.forEach((item, i) => {
      if (item.match === match && (callback === undefined || item.callback === callback)) {
        this._listeners.splice(i, 1)
      }
    })
    return this
  }

  _dispatch(event, state) {
    const dispatchers = []
    this._listeners.forEach((item) => {
      const { match, callback, exact } = item
      // i.e. on('*', callback)
      if (match === '*') {
        dispatchers.push(callback)
      }
      // bind events i.e. on('$enter', callback)
      else if (match === event) {
        callback.call(this, state)
      }
      // i.e. on('!', callback)
      else if (event === '$notFound') {
        if (match === '!') {
          callback.call(this, state)
        }
      }
      else if (event === '$enter') {
        if (this.is(match, exact)) {
          callback.call(this, this.state)
        }
      }
    })
    // call '*' at last
    dispatchers.forEach((callback) => callback.call(this, state))
  }

  _onLeave() {
    const state = this.state
    const { route } = state
    if (route && route.onLeave) {
      onLeave.call(this, state)
    }
    this._dispatch('$leave', state)
  }

  _onEnter() {
    const state = this.state
    const { route } = state
    if (route && route.onEnter) {
      onEnter.call(this, state)
    }
    this.status = 1
    this._dispatch('$enter', state)
  }

  _onNotFound() {
    if (this.options.onNotFound) {
      this.options.onNotFound.call(this)
    }
    this.status = 0
    this._dispatch('$notFound')
  }

  /**
   * check whether match the current state
   * @param {string} match base + path + search
   * @param {boolean} exact
   */
  is(match, exact = false) {
    if (this.status < 0) {
      return false
    }

    if (!this.status) {
      return match === '!'
    }

    if (match === '*') {
      return true
    }

    const state = this.getState()
    const { name, path } = state

    if (isString(match)) {
      if (match === name) {
        return true
      }
      if (name.indexOf(match + '.') === 0 && !exact) {
        return true
      }
      if (match === path) {
        return true
      }
      if (path.indexOf(match) === 0 && !exact) {
        return true
      }

      const info = this.parseUrlToState(match)
      if (info && info.name === name) {
        return true
      }
      if (info && name.indexOf(info.name + '.') === 0 && !exact) {
        return true
      }
    }
    if (match instanceof RegExp) {
      return match.test(path)
    }
    if (isFunction(match)) {
      return match(state)
    }

    return false
  }

  go(name, params = {}, replace = false) {
    const state = this.makeState(name, params)

    this._dispatch('$forward', state)

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

    this._dispatch('$change', state)
  }

  open(url, params) {
    // sideEffects
  }

  back(count = -1) {
    const len = this._history.length
    const point = len + count
    this._history.splice(point, -count)

    if (this._history.length) {
      const latest = this._history.pop()
      this._dispatch('$back', latest)
      this.push(latest)
    }
    else {
      this._dispatch('$backEmpty')
      const { defaultRoute } = this.options
      if (defaultRoute) {
        const parsed = this._parseDefaultRoute(defaultRoute)
        if (parsed) {
          this.go(...parsed)
        }
      }
    }
  }

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
  }

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
  }

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
    const url = this.makeUrl(path, combineParams)
    const clearUrl = url.replace(/\/+$/, '') || '/'

    return {
      name,
      path: clearUrl,
      params: combineParams,
      route,
    }
  }

  makeUrl(to, params = {}) {
    const url = to.replace(new RegExp(':([a-z][a-zA-Z0-9]+)', 'g'), (matched, key) => {
      if (inObject(key, params)) {
        return params[key]
      }
      return matched
    })
    return url
  }

  /**
   * @param {string} url the whole url which generated by navigation (base + path + search, without hash)
   * @return {object} state
   */
  parseUrlToState(url) {
    const { path, search } = this.$parseUrl(url)
    const { base } = this._getMode()
    const uri = path.replace(base, '')
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

    const searchParams = this.$parseSearchToParams(search)
    const routeParams = route.params || {}
    // route params have higher priority then search query
    const combineParams = { ...searchParams, ...routeParams, ...params }

    return {
      name: route.name,
      path: uri,
      params: combineParams,
      route,
    }
  }

  $parseUrl(url) {
    const [path, hash = ''] = url.split('#')
    const [pathname, search = ''] = path.split('?')
    return { path, pathname, search, hash }
  }

  $parseSearchToParams(search) {
    const params = {}
    const segs = search.replace(/^\?/, '').split('&')
    for (let i = 0, len = segs.length; i < len; i ++) {
      if (segs[i]) {
        let p = segs[i].split('=')
        params[p[0]] = p[1]
      }
    }
    return params
  }

  changeLocation(nextState, replace = false) {
    // sideEffects
  }

  static defaultOptions = {
    maxHistoryLength: 20,
  }
}
export default Navigation
