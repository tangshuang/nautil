import { parseUrl, parseSearch, resolveUrl, findInfoByMapping } from '../utils.js'
import { createContext, useContext, useEffect, useMemo } from 'react'
import { useForceUpdate } from '../hooks/force-update.js'
import { History } from './history.js'
import { useShallowLatest } from '../hooks/shallow-latest.js'
import { ModuleBaseComponent } from '../core/module.jsx'
import { isInheritedOf, createSafeExp, isFunction } from 'ts-fns'

export const rootContext = createContext()
const absContext = createContext({
  abs: '/',
  deep: [],
})
const routeContext = createContext({})
const routerContext = createContext({})
const paramsContext = createContext({})
const mappingContext = createContext([])

export class Router {
  constructor(options) {
    const { routes, ...opts } = options
    this.routes = routes
    this.options = opts
    this.init()
  }

  init() {
    // to be override
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
    let index
    let notFound
    let defaultRoute
    let redirect
    for (let i = 0, len = routes.length; i < len; i++) {
      const item = routes[i]
      const { name, path = name, exact } = item

      if (path === '') {
        index = item
      } else if (path === '!') {
        notFound = item
      }

      if (item.default) {
        defaultRoute = item
      }

      // index route
      if (path === '' && pathname === '') {
        route = item
        break
      }

      const routePathBlocks = path.split('/')
      if (exact && routePathBlocks.length !== uriBlocks.length) {
        break
      }

      // if (diffBlocks(blocks, infoBlocks) && diffSearch(pathinfo.params, info.params)) {
      if (diffBlocks(routePathBlocks, uriBlocks)) {
        route = item
        break
      }
    }

    // use defualt route as index
    if (!route && pathname === '' && defaultRoute) {
      route = defaultRoute
      redirect = defaultRoute.path || defaultRoute.name
    }

    // not found and has no notFound item, we use index as fallback
    if (!route && index && !index.exact) {
      route = index
    }

    // not found
    if (!route) {
      const route = notFound || {
        path: '!',
        component: notFound ? notFound.component : () => null,
      }
      return {
        ...route,
        params: { ...query },
        url,
        pathname,
        search,
        query,
        route,
      }
    }

    // route params have higher priority then search query
    const combineParams = { ...query, ...params }
    const path = blocks.join('/')

    return {
      path,
      component: route.component,
      params: combineParams,
      url,
      pathname,
      search,
      query,
      redirect: redirect ? redirect : route.redirect,
      exact: route.exact,
      route,
    }
  }

  Link = Link.bind(this)
  useNavigate = useRouteNavigate.bind(this)
  useLocation = useRouteLocation.bind(this)
  useParams = useRouteParams.bind(this)
  useMatch = useRouteMatch.bind(this)
  usePrefetch = useRoutePrefetch.bind(this)

  Outlet = (props) => {
    const forceUpdate = useForceUpdate()
    useHistoryListener(forceUpdate)

    const { history, mode } = useContext(rootContext)
    const { abs, deep } = useContext(absContext)
    const { current: parent } = useContext(routerContext)

    const url = history.getUrl(abs, mode)
    const state = this.parseUrlToState(url)

    const { component: C, path, params, redirect, exact, route } = state

    const { found: finalProps, notFound: propsNotFound } = findInfoByMapping(props, route.props)
    if (propsNotFound.length && process.env.NODE_ENV !== 'production') {
      console.error(`Route ${abs}:${path} component not found required props: ${propsNotFound.join(',')}`)
    }

    const absInfo = useMemo(() => {
      const newAbs = resolveUrl(abs, path)
      const newDeep = [...deep, { url, path, abs: newAbs, router: this, route, state }]
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
        exact,
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

    const { mapping = {} } = this.options
    const parentMapping = useContext(mappingContext) || []
    const mapInfo = useMemo(
      () => [
        {
          abs: routerInfo.abs,
          mapping,
        },
        ...parentMapping,
      ],
      [parentMapping, routerInfo],
    )

    const { Provider: AbsProvider } = absContext
    const { Provider: RouteProvider } = routeContext
    const { Provider: RouterProvider } = routerContext
    const { Provider: ParamsProvider } = paramsContext
    const { Provider: MappingProvider } = mappingContext

    const navigate = this.useNavigate()

    useEffect(() => {
      if (!redirect) {
        return
      }

      const redirectTo = typeof redirect === 'function' ? redirect(finalProps) : redirect
      navigate(redirectTo, params, true)
    }, [redirect])

    const inheritedParams = useContext(paramsContext)
    const basicParams = { ...params, ...inheritedParams }
    const { found: paramsFound, notFound: paramsNotFound } = findInfoByMapping(basicParams, route.params)
    const passDownParams = { ...basicParams, ...paramsFound }
    if (paramsNotFound.length && process.env.NODE_ENV !== 'production') {
      console.error(`Route ${abs}:${path} component not found required params: ${paramsNotFound.join(',')}`)
    }

    if (redirect && !C) {
      return null
    }

    return (
      <AbsProvider value={absInfo}>
        <RouterProvider value={routerInfo}>
          <RouteProvider value={routeInfo}>
            <ParamsProvider value={passDownParams}>
              <MappingProvider value={mapInfo}>
                {this.render(C, finalProps, { forceUpdate, url, history, abs, mode, path, params })}
              </MappingProvider>
            </ParamsProvider>
          </RouteProvider>
        </RouterProvider>
      </AbsProvider>
    )
  }

  // can be override
  render(C, props, _extra) {
    return <C {...props} />
  }

  static $createLink(_data) {
    throw new Error('[Nautil]: Router.$createLink should must be override.')
  }

  static $createNavigate(history, getAbs, mode, _otions) {
    return (to, params, type) => {
      if (typeof to === 'number') {
        to > 0 ? history.forword() : history.back()
        return
      }
      history.setUrl(to, getAbs(to, params), mode, params, type)
    }
  }

  static $createPermanentNavigate(getPath, { history, mode }) {
    return (name, params = {}, type) => {
      const path = getPath(name)

      if (path === '.') {
        history.setUrl('.', null, null, params, type)
        return
      }

      if (isFunction(path)) {
        path(params, type)
        return
      }

      const args = { ...params }
      const items = path.split('/')
      const res = items.map((item) => {
        if (item[0] === ':') {
          const key = item.substring(1)
          if (params[key]) {
            delete args[key]
            return params[key]
          }
        }
        return item
      })
      const pathStr = res.join('/')
      history.setUrl(pathStr, '/', mode, args, type)
    }
  }

  /**
   *
   * @param {*} ctx generated context which should pass into rootContext
   * @param {*} children
   * @param {*} options options from createBootstap router option
   * @returns
   */
  static $createRootProvider(ctx, children, _options) {
    const { Provider } = rootContext
    return <Provider value={ctx}>{children}</Provider>
  }
}

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
      options: value,
    }
  }, [value])

  const { Provider } = mappingContext
  const map = useMemo(() => {
    const { options } = ctx
    const { mapping } = options
    return [
      {
        router: null,
        mapping,
      },
    ]
  }, [ctx])

  return <Provider value={map}>{Router.$createRootProvider(ctx, children, value)}</Provider>
}

export function useLocation() {
  const forceUpdate = useForceUpdate()
  useHistoryListener(forceUpdate)

  const { deep } = useContext(absContext)
  const { history } = useContext(rootContext)

  return {
    ...history.location,
    deep,
  }
}

export function useHistoryListener(fn, deps = []) {
  const { history } = useContext(rootContext)
  useEffect(() => {
    history.on('change', fn)
    return () => history.off('change', fn)
  }, deps)
}

const createGetAbs = (inHost, abs, routerAbs, routeAbs, routeUrl) => (to) => {
  if (/^\.\.?\//.test(to)) {
    return [routeAbs, routeUrl].filter(Boolean).join('/')
  }
  if (inHost) {
    return abs
  }
  return routerAbs
}

const useGetAbs = (inHost) => {
  const { abs } = useContext(absContext)
  const { abs: currentRouterAbs = abs } = useContext(routerContext)
  const { abs: routeAbs, url } = useContext(routeContext)
  const getAbs = createGetAbs(inHost, abs, currentRouterAbs, routeAbs, url)
  return getAbs
}

export function Link(props) {
  const { to, replace, open, params, ...attrs } = props

  const { history, mode } = useContext(rootContext)

  const getAbs = useGetAbs(this && this instanceof Router)
  const navigateTo = useRouteNavigate.call(this)

  const args = useShallowLatest(params)
  const finalAbs = getAbs(to)

  const { href, navigate } = useMemo(() => {
    const href = typeof to === 'number' ? '#' : history.makeUrl(to, finalAbs, mode, args)
    const navigate = () => navigateTo(to, args, open ? 'open' : replace ? true : false)
    return { href, navigate }
  }, [to, args, mode, replace, finalAbs, history])

  return Router.$createLink({ ...attrs, href, open, navigate })
}

export function useRouteNavigate() {
  const forceUpdate = useForceUpdate()
  useHistoryListener(forceUpdate)

  const { history, mode } = useContext(rootContext)
  const { deep } = useContext(absContext)
  const { current } = useContext(routerContext)

  const inHost = this && this instanceof Router
  const router = inHost ? this : current

  const getAbs = useGetAbs(inHost)

  return Router.$createNavigate(history, getAbs, mode, { deep, router, inHost })
}

export function useRouteBack() {
  const navigate = useRouteNavigate()
  const history = useHistory()
  return (fallback) => {
    // * @param fallback 当history中没有可以再回退的上一个页面时，会以fallback作为目标，避免点击后没有任何效果
    if (!history.stack?.length) {
      if (fallback) {
        navigate(fallback)
      } else {
        navigate('/')
      }
      return
    }
    navigate(-1)
  }
}

export function useRouteParams() {
  const forceUpdate = useForceUpdate()
  useHistoryListener(forceUpdate)

  const { abs } = useContext(absContext)
  const { history, mode } = useContext(rootContext)
  const { params: routeParams } = useContext(routeContext)
  const inheritedParams = useContext(paramsContext)

  // top level use
  if (this && this instanceof Router) {
    const url = history.getUrl(abs, mode)
    const { params } = this.parseUrlToState(url)
    return { ...inheritedParams, ...params }
  }
  else if (routeParams) {
    return { ...inheritedParams, ...routeParams }
  }
  else {
    return { ...inheritedParams }
  }
}

export function useRouteMatch() {
  const forceUpdate = useForceUpdate()
  useHistoryListener(forceUpdate)

  const { abs } = useContext(absContext)
  const { history, mode } = useContext(rootContext)
  const { path: routePath, url, exact } = useContext(routeContext)

  let currentPath = null
  let currentUrl = ''
  // top level use
  if (this && this instanceof Router) {
    const url = history.getUrl(abs, mode)
    const { path } = this.parseUrlToState(url)
    currentPath = path
    currentUrl = url
  }
  else if (routePath) {
    currentPath = routePath
    currentUrl = url
  }

  return (pattern) => {
    if (pattern === currentPath) {
      return true
    }

    if (pattern === '') {
      return exact ? currentPath === '' : currentPath !== '!'
    }

    if (!exact && typeof pattern === 'string' && (currentPath + '/').indexOf(pattern) === 0) {
      return true
    }

    if (pattern && pattern instanceof RegExp && pattern.test(currentUrl)) {
      return true
    }

    return false
  }
}

export function useRouteLocation() {
  const forceUpdate = useForceUpdate()
  useHistoryListener(forceUpdate)

  const { path, params, url } = useContext(routeContext)
  const { abs, deep } = useContext(absContext)
  const { history, mode } = useContext(rootContext)

  const loc = {
    abs,
    deep,
    url,
    path,
    params,
  }

  if (this && this instanceof Router) {
    const url = history.getUrl(abs, mode)
    const { path, params } = this.parseUrlToState(url)
    Object.assign(loc, { path, params })
  }

  return loc
}

/**
 * 基于route提前加载目标模块代码
 * @returns
 */
export function useRoutePrefetch() {
  const { current } = useContext(routerContext)

  /**
   * 目标路由path，注意，仅限当前路由内部的path，无法做到跨父级
   */
  return (to) => {
    let foundComponent = null

    if (this && this instanceof Router) {
      const state = this.parseUrlToState(to)
      const { component } = state
      foundComponent = component
    } else if (current && current instanceof Router) {
      const state = current.parseUrlToState(to)
      const { component } = state
      foundComponent = component
    }

    if (foundComponent && isInheritedOf(foundComponent, ModuleBaseComponent) && typeof foundComponent.meta?.source === 'function') {
      foundComponent.meta.source()
    }
  }
}

export function useRouteState(path, exact) {
  const navigate = useRouteNavigate()
  const [prefix, ...rests] = path.split(/\/(?=:)/)
  const suffix = rests.join('/')
  const { path: routePath, url: routeUrl, params } = useContext(routeContext)

  const isActive = () => {
    // 直接""表示不跟随任何url段，但此时必须注意，如果exact为false的时候，表示永远匹配上了
    if (path === '' && exact) {
      return routePath === routeUrl
    }
    const isEnd = new RegExp(`${createSafeExp(`/${prefix}`)}$`).test(routeUrl)
    if (routeUrl.indexOf(`/${prefix}/`) === -1 && !isEnd) {
      return false
    }
    if (!suffix) {
      return true
    }
    if (isEnd) {
      return false
    }

    const matchedUrl = routeUrl.split(`/${prefix}/`).pop()

    const urlBlocks = matchedUrl.split('/')
    const pathBlocks = suffix.split('/')

    if (exact && urlBlocks.length !== pathBlocks.length) {
      return false
    }

    if (urlBlocks.length < pathBlocks.length) {
      return false
    }

    for (let i = 0, len = pathBlocks.length; i < len; i++) {
      const urlBlock = urlBlocks[i]
      const pathBlock = pathBlocks[i]

      if (pathBlock[0] === ':') {
        if (urlBlock === undefined) {
          return false
        }
      } else if (urlBlock !== pathBlock) {
        return false
      }
    }

    return true
  }

  const setActive = (params) => {
    // 注意，同一时间只能打开一个，即使参数不一样
    // 参数变化时，应该先关闭已经打开的，再使用新参数打开
    if (!isActive) {
      navigate(`./${path}`, params)
    }
  }
  const setInactive = () => {
    const backUrl = routeUrl.split(`/${prefix}`).shift()
    navigate(backUrl, params, true)
  }

  return { isActive, setActive, setInactive }
}

export function Route(props) {
  const { path, exact, render, ...attrs } = props
  const { isActive } = useRouteState(path, exact)
  return isActive() ? render(attrs) : null
}

export function createRouteComponent(path, create, exact) {
  function useIsComponentActive() {
    const { isActive } = useRouteState(path, exact)
    return isActive()
  }

  function useActiveComponent() {
    const { setActive } = useRouteState(path, exact)
    return setActive
  }

  function useInactiveComponent() {
    const { setInactive } = useRouteState(path, exact)
    return setInactive
  }

  function useComponentParams() {
    const isActive = useIsComponentActive()
    const { url } = useContext(routeContext)

    if (!isActive) {
      return {}
    }

    const [prefix, ...rests] = path.split(/\/(?=:)/)
    const suffix = rests.join('/')

    if (!suffix) {
      return {}
    }

    const foundUrl = url.split(`/${prefix}/`).pop()

    const params = {}
    const urlBlocks = foundUrl.split('/')
    const pathBlocks = suffix.split('/')
    for (let i = 0, len = pathBlocks.length; i < len; i++) {
      const urlBlock = urlBlocks[i]
      const pathBlock = pathBlocks[i]
      if (pathBlock[0] === ':') {
        const key = pathBlock.substring(1)
        params[key] = urlBlock
      }
    }
    return params
  }

  function Link(props) {
    return <Link {...props} to={`./${path}`} />
  }

  const C = create({ useInactiveComponent, useActiveComponent, Link, useIsComponentActive, useComponentParams })
  function Component(props) {
    return <C {...props} />
  }

  return { useInactiveComponent, useActiveComponent, Link, useIsComponentActive, Component, useComponentParams }
}

function usePermanentGetPath() {
  const mapping = useContext(mappingContext)
  const getPath = (name) => {
    if (name === '.') {
      return '.'
    }

    // use '..' or '../..' to go up to upper router path
    if (/[.|/]+/.test(name)) {
      const items = name.split('/')
      if (items[0] === '.') {
        if (items.length === 1) {
          return '.'
        }
        items.shift()
      }
      const count = items.length
      const target = mapping[count]
      if (!target) {
        return '/'
      }
      return target.abs || '/'
    }

    const item = mapping.find((item) => typeof item.mapping?.[name] !== 'undefined')
    if (!item) {
      console.error(`Global route ${name} not defined.`)
      return
    }

    const { abs } = item
    const nav = item.mapping[name]
    const path = resolveUrl(abs, nav)
    return path
  }
  return getPath
}

export function usePermanentNavigate() {
  const { history, mode } = useContext(rootContext)
  const getPath = usePermanentGetPath()
  return Router.$createPermanentNavigate(getPath, { history, mode })
}

export function usePermanentLink() {
  const getPath = usePermanentGetPath()
  return Router.$createPermanentLink(getPath)
}

export function useHistory() {
  const { history } = useContext(rootContext)
  return history
}
