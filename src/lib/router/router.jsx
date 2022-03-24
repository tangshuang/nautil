import { parseUrl, parseSearch, resolveUrl } from '../utils.js'
import { createContext, useContext, useEffect, useMemo } from 'react'
import { useForceUpdate } from '../hooks/force-update.js'
import { History } from './history.js'

const rootContext = createContext()
const absContext = createContext({
  abs: '',
  deep: [],
})
const routeContext = createContext({})
const routerContext = createContext({})

export function RouterRootProvider({ value, children }) {
  // this Provider can only be used once in one application
  const parent = useContext(rootContext)
  if (parent) {
    throw new Error('[Nautil]: RouterRootProvider can only be used on your root application component with createBootstrap')
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

  const { Provider } = rootContext

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

  Link = Link.bind(this)
  useLocation = useRouteLocation.bind(this)
  useNavigate = useNavigate.bind(this)
  useListener = useHistoryListener.bind(this)
  useParams = useRouteParams.bind(this)
  useMatch = useRouteMatch.bind(this)

  Outlet = (props) => {
    const forceUpdate = useForceUpdate()
    useHistoryListener(forceUpdate)

    const { history, mode } = useContext(rootContext)
    const { abs, deep } = useContext(absContext)
    const { current: parent } = useContext(routerContext)

    const url = history.$getUrl(abs, mode)
    const state = this.parseUrlToState(url)

    const { component: C, path, params } = state

    const absInfo = useMemo(() => {
      const newAbs = resolveUrl(abs, path)
      const newDeep = [...deep, path]
      return {
        abs: newAbs,
        deep: newDeep,
      }
    }, [url])

    const routeInfo = useMemo(() => {
      return {
        abs,
        url,
        path,
        params,
      }
    }, [url])

    const routerInfo = useMemo(() => {
      return {
        abs,
        deep,
        current: this,
        parent,
      }
    }, [abs])

    const { Provider: AbsProvider } = absContext
    const { Provider: RouteProvider } = routeContext
    const { Provider: RouterProvider } = routerContext

    return (
      <AbsProvider value={absInfo}>
        <RouterProvider value={routerInfo}>
          <RouteProvider value={routeInfo}>
            <C {...props} />
          </RouteProvider>
        </RouterProvider>
      </AbsProvider>
    )
  }

  static $createLink(data) {
    throw new Error('[Nautil]: Router.$createLink should must be override.')
  }
}

export function Link(props) {
  const { to, replace, open, params, ...attrs } = props

  const forceUpdate = useForceUpdate()
  useHistoryListener(forceUpdate)

  const { history, mode } = useContext(rootContext)
  const { abs } = useContext(absContext)
  const { abs: currentRouterAbs = abs } = useContext(routerContext)

  const navigateTo = useNavigate()

  const href = history.$makeUrl(to, currentRouterAbs, mode, params)
  const navigate = () => navigateTo(to, params, replace)
  return Router.$createLink({ ...attrs, href, open, navigate })
}

export function useNavigate() {
  const forceUpdate = useForceUpdate()
  useHistoryListener(forceUpdate)

  const { history, mode } = useContext(rootContext)
  const { abs } = useContext(absContext)
  const { abs: currentRouterAbs = abs } = useContext(routerContext)

  return (to, params, replace) => {
    history.$setUrl(to, currentRouterAbs, mode, params, replace)
  }
}

export function useLocation() {
  const forceUpdate = useForceUpdate()
  useHistoryListener(forceUpdate)

  const { deep } = useContext(absContext)
  const { history } = useContext(rootContext)

  return {
    ...history.location,
    route: deep,
  }
}

export function useHistoryListener(fn) {
  const { history } = useContext(rootContext)
  useEffect(() => {
    history.listen(fn)
    return () => history.unlisten(fn)
  }, [])
}

export function useRouteParams() {
  const forceUpdate = useForceUpdate()
  useHistoryListener(forceUpdate)

  const { abs } = useContext(absContext)
  const { history, mode } = useContext(rootContext)
  const { abs: currentRouterAbs = abs } = useContext(routerContext)
  const { params: routeParams } = useContext(routeContext)

  // top level use
  if (this && this instanceof Router) {
    const url = history.$getUrl(currentRouterAbs, mode)
    const { params } = this.parseUrlToState(url)
    return params
  }
  else if (routeParams) {
    return routeParams
  }
  else {
    return {}
  }
}

export function useRouteMatch() {
  const forceUpdate = useForceUpdate()
  useHistoryListener(forceUpdate)

  const { abs } = useContext(absContext)
  const { history, mode } = useContext(rootContext)
  const { abs: currentRouterAbs = abs } = useContext(routerContext)
  const { path: routePath } = useContext(routeContext)

  let currentPath = null
  // top level use
  if (this && this instanceof Router) {
    const url = history.$getUrl(currentRouterAbs, mode)
    const { path } = this.parseUrlToState(url)
    currentPath = path
  }
  else if (routePath) {
    currentPath = routePath
  }

  return (pattern) => {
    if (pattern === currentPath) {
      return true
    }

    if (pattern && pattern instanceof RegExp && pattern.test(currentPath)) {
      return true
    }

    return false
  }
}

export function useRouteLocation() {
  const forceUpdate = useForceUpdate()
  useHistoryListener(forceUpdate)

  const { path, params } = useContext(routeContext)
  const { abs, deep } = useContext(absContext)

  return {
    path,
    abs,
    route: deep,
    params,
  }
}
