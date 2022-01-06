import { parseUrl, parseSearch } from '../utils.js'
import { createContext, useContext, useRef, useMemo } from 'react'

let currentUrl = '/'
const navigatorContext = createContext({})

export class Router {
  constructor(options) {
    const { routes, ...opts } = options
    this.routes = routes
    this.options = opts

    this.history = []
    this.curr = 0
  }

  getMode() {
    const { mode } = this.options
    const createBase = root => root

    if (!mode) {
      const base = createBase('')
      return this.$mapMode({ type: 'memo', query: '', base })
    }

    if (mode.indexOf('/') === 0) {
      const root = mode === '/' ? '' : mode
      const base = createBase(root)
      return this.$mapMode({ type: 'history', query: '', base })
    }

    if (mode.indexOf('#?') === 0) {
      const [query, root = ''] = mode.substring(2).split('=')
      const base = createBase(root)
      return this.$mapMode({ type: 'hash_search', query, base })
    }

    if (mode.indexOf('#') === 0) {
      const root = mode.substring(1)
      const base = createBase(root)
      return this.$mapMode({ type: 'hash', query: '', base })
    }

    if (mode.indexOf('?') === 0) {
      const [query, root = ''] = mode.substring(1).split('=')
      const base = createBase(root)
      return this.$mapMode({ type: 'search', query, base })
    }

    const base = createBase('')
    return this.$mapMode({ type: 'storage', query: '', base })
  }

  $mapMode(mode) {
    return mode
  }

  /**
   * @param {string} url home/view1
   * @return {object|null} state, null means not find any route
   */
  parseUrlToState(url) {
    if (!url || typeof url !== 'string') {
      return null
    }

    const { pathname, search } = parseUrl(url)
    const query = parseSearch(search)

    const params = {}
    const blocks = []

    const diffBlocks = (route, target) => {
      // if the given url is less than required, it does not match this route
      if (target.length < route.length) {
        return false
      }

      blocks = []
      for (let i = 0, len = route.length; i < len; i ++) {
        const routeBlock = route[i]
        const targetBlock = target[i]

        // not equal at normal block
        if (routeBlock[0] !== ':' && routeBlock !== targetBlock) {
          return false
        }

        if (routeBlock[0] === ':') {
          const key = routeBlock.substr(1)
          params[key] = targetBlock
        }

        blocks.push(targetBlock)
      }

      return true
    }

    const routes = this.routes
    const uriBlocks = pathname.split('/')

    let route
    for (let i = 0, len = routes.length; i < len; i ++) {
      const item = routes[i]
      const { path } =  item
      const routePathBlocks = path.split('/')
      // if (diffBlocks(blocks, infoBlocks) && diffSearch(pathinfo.params, info.params)) {
      if (diffBlocks(routePathBlocks, uriBlocks)) {
        route = item
        break
      }
    }

    if (!route) {
      return null
    }

    const routeParams = route.params || {}
    // route params have higher priority then search query
    const combineParams = { ...routeParams, ...query, ...params }
    const path = blocks.join('/')

    return {
      path,
      component: route.component,
      params: combineParams,
      url,
      pathname,
      search,
      query,
    }
  }
}

class Navigator {
  constructor(options) {
    this.router = new Router(options)
    this.watchers = []
  }

  subscribe(fn) {
    this.watchers.push(fn)
  }

  unsubscribe(fn) {
    this.watchers = this.watchers.filter(item => item !== fn)
  }

  dispatch() {
    this.watchers.forEach((fn) => {
      fn(state)
    })
  }

  Outlet = () => {
    const { abs = '' } = useContext(navigatorContext)
    const absUrl = this.$getUrl()
    const url = abs ? absUrl.replace(abs, '') : absUrl
    const state = this.router.parseUrlToState(url)

    const ref = useRef({})

    if (!state) {
      return null
    }

    const { component: C, path, params } = state
    const { Provider } = navigatorContext
    const absPath = `${abs}/${path}`
    if (ref.current.abs !== absPath) {
      ref.current.abs = absPath
    }

    return (
      <Provider value={ref.current}>
        <C {...params} />
      </Provider>
    )
  }

  back(num) {
    const prev = this.curr - num
    const latest = this.history[prev]
    this.curr = prev
    this.replace(latest)
  }

  forward(num) {
    const next = this.curr + num
    const latest = this.history[next]
    this.curr = next
    this.replace(latest)
  }

  $getUrl() {
    return currentUrl
  }

  $setUrl(url) {
    currentUrl = url
  }

  go(url) {}

  replace(url) {
    const state = this.parseUrlToState(url)
    this.dispatch(state)
  }
}
