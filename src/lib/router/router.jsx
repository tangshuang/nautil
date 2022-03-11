import { parseUrl, parseSearch, resolveUrl } from '../utils.js'
import { createContext, useContext, useEffect, useMemo } from 'react'
import { useForceUpdate } from '../hooks/force-update.js'
import { History } from './history.js'

const absContext = createContext('')
const routerContext = createContext()

export function RouterProvider({ value, children }) {
  const parent = useContext(routerContext)
  if (parent) {
    throw new Error('[Nautil]: RouterProvider can only be used on your root application component with createBootstrap')
  }

  const getMode = (mode) => {
    const createBase = root => root

    if (!mode) {
      const base = createBase('')
      return { type: 'memo', query: '', base }
    }

    if (mode.indexOf('/') === 0) {
      const root = mode === '/' ? '' : mode
      const base = createBase(root)
      return { type: 'history', query: '', base }
    }

    if (mode.indexOf('#?') === 0) {
      const [query, root = ''] = mode.substring(2).split('=')
      const base = createBase(root)
      return { type: 'hash_search', query, base }
    }

    if (mode.indexOf('#') === 0) {
      const root = mode.substring(1)
      const base = createBase(root)
      return { type: 'hash', query: '', base }
    }

    if (mode.indexOf('?') === 0) {
      const [query, root = ''] = mode.substring(1).split('=')
      const base = createBase(root)
      return { type: 'search', query, base }
    }

    const base = createBase('')
    return { type: 'storage', query: '', base }
  }

  const ctx = useMemo(() => {
    const { mode } = value || {}
    const { type, query, base } = getMode(mode)
    const history = History.createHistory(type)
    return {
      history,
      mode: {
        type,
        query,
        base,
      },
    }
  }, [value])

  const { Provider } = routerContext

  return (
    <Provider value={ctx}>
      {children}
    </Provider>
  )
}

export class Router {
  constructor(options) {
    const { routes, ...opts } = options
    this.routes = routes
    this.options = opts
  }

  /**
   * @param {string} url home/view1
   * @return {object|null} state, null means not find any route
   */
  parseUrlToState(url) {
    const { pathname, search } = parseUrl(url)
    const query = parseSearch(search)

    const params = {}
    let blocks = []

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

      // index route
      if (path === '' && pathname === '') {
        route = item
        break
      }

      const routePathBlocks = path.split('/')
      // if (diffBlocks(blocks, infoBlocks) && diffSearch(pathinfo.params, info.params)) {
      if (diffBlocks(routePathBlocks, uriBlocks)) {
        route = item
        break
      }
    }

    // not found
    if (!route) {
      const notFound = routes.find(item => item.path === '!')
      const routeParams = notFound?.params || {}
      return {
        path: '!',
        component: notFound ? notFound.component : () => null,
        params: { ...routeParams, ...query }
      }
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
      redirect: route.redirect,
    }
  }

  Link = Link
  useListener = useHistoryListener
  useLocation = useLocation
  useNavigate = useNavigate

  Outlet = (props) => {
    const abs = useContext(absContext)
    const { history, mode } = useContext(routerContext)

    const url = history.$getUrl(abs, mode)
    const state = this.parseUrlToState(url)

    const forceUpdate = useForceUpdate()
    this.useListener(forceUpdate)

    const { component: C, path, params } = state
    const { Provider } = absContext
    const absPath = resolveUrl(abs, path)

    return (
      <Provider value={absPath}>
        <C params={params} {...props} />
      </Provider>
    )
  }

  useParams = () => {
    const abs = useContext(absContext)
    const { history, mode } = useContext(routerContext)

    const forceUpdate = useForceUpdate()
    this.useListener(forceUpdate)

    const url = history.$getUrl(abs, mode)
    const state = this.parseUrlToState(url)
    const { params } = state
    return params
  }

  useMatch = () => {
    const abs = useContext(absContext)
    const { history, mode } = useContext(routerContext)

    const forceUpdate = useForceUpdate()
    this.useListener(forceUpdate)

    return (pattern) => {
      const url = history.$getUrl(abs, mode)
      const state = this.parseUrlToState(url)
      const { path } = state

      if (pattern === path) {
        return true
      }

      if (pattern instanceof RegExp && pattern.test(path)) {
        return true
      }

      return false
    }
  }

  static $createLink(data) {
    throw new Error('[Nautil]: Router.$createLink should must be override.')
  }
}

export function Link(props) {
  const { to, replace, open, ...attrs } = props

  const abs = useContext(absContext)
  const { history, mode } = useContext(routerContext)

  const href = history.$makeUrl(to, abs, mode)
  const navigate = () => history.$setUrl(to, abs, mode, replace)
  return Router.$createLink({ ...attrs, href, open, navigate })
}

export function useNavigate() {
  const abs = useContext(absContext)
  const { history, mode } = useContext(routerContext)

  const forceUpdate = useForceUpdate()
  useHistoryListener(forceUpdate)

  return (to, replace) => {
    history.$setUrl(to, abs, mode, replace)
  }
}

export function useLocation() {
  const abs = useContext(absContext)
  const { history, mode } = useContext(routerContext)

  const forceUpdate = useForceUpdate()
  useHistoryListener(forceUpdate)

  const url = history.$getUrl(abs, mode)
  const { pathname, search, hash } = parseUrl(url)
  const query = parseSearch(search)

  return { pathname, search, query, hash, url }
}

function useHistoryListener(fn) {
  const { history } = useContext(routerContext)
  useEffect(() => {
    history.listen(fn)
    return () => history.unlisten(fn)
  }, [])
}
