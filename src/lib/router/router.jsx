import { parseUrl, parseSearch, resolveUrl } from '../utils.js'
import { createContext, useContext, useEffect, useMemo } from 'react'
import { useForceUpdate } from '../hooks/force-update.js'
import { History } from './history.js'
import { useShallowLatest } from '../hooks/shallow-latest.js'
import { ModuleBaseComponent } from '../core/module.jsx'
import { isInheritedOf } from 'ts-fns'

export const rootContext = createContext()
const absContext = createContext({
  abs: '/',
  deep: [],
})
const routeContext = createContext({})
const routerContext = createContext({})
const paramsContext = createContext({})

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
      const routeParams = notFound?.params || {}
      const route = notFound || {
        path: '!',
        component: notFound ? notFound.component : () => null,
      }
      return {
        ...route,
        params: { ...routeParams, ...query },
        url,
        pathname,
        search,
        query,
        route,
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

    const propsMapping = route.props || {}
    const finalProps = {}
    const propsKeys = Object.keys(propsMapping)
    propsKeys.forEach((key) => {
      const prop = propsMapping[key]
      finalProps[prop === true ? key : prop] = props[key]
    })

    const absInfo = useMemo(() => {
      const newAbs = resolveUrl(abs, path)
      const newDeep = [...deep, { abs: newAbs, router: this, route, state }]
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

    const { Provider: AbsProvider } = absContext
    const { Provider: RouteProvider } = routeContext
    const { Provider: RouterProvider } = routerContext
    const { Provider: ParamsProvider } = paramsContext

    const navigate = this.useNavigate()

    useEffect(() => {
      if (!redirect) {
        return
      }

      const redirectTo = typeof redirect === 'function' ? redirect(finalProps) : redirect
      navigate(redirectTo, params, true)
    }, [redirect])

    const inheritedParams = useContext(paramsContext)
    const paramsMapping = route.params || {}
    const passDownParams = { ...inheritedParams, ...params }
    const keys = Object.keys(paramsMapping)
    keys.forEach((key) => {
      const prop = paramsMapping[key]
      passDownParams[prop === true ? key : prop] = params[key]
    })

    if (redirect) {
      return null
    }

    return (
      <AbsProvider value={absInfo}>
        <RouterProvider value={routerInfo}>
          <RouteProvider value={routeInfo}>
            <ParamsProvider value={passDownParams}>
              {this.render(C, finalProps, { forceUpdate, url, history, abs, mode, path, params })}
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
    return (to, params, replace) => {
      if (typeof to === 'number') {
        to > 0 ? history.forword() : history.back()
        return
      }
      history.setUrl(to, getAbs(to, params), mode, params, replace)
    }
  }

  static $createPermanentNavigate(getPath, { history, mode }) {
    return (name, params = {}, replace = false) => {
      const path = getPath(name)

      if (path === '.') {
        history.setUrl('.', null, null, params, replace)
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
      history.setUrl(pathStr, '/', mode, args, replace)
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

  return Router.$createRootProvider(ctx, children, value)
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

export function Link(props) {
  const { to, replace, open, params, ...attrs } = props

  const { history, mode } = useContext(rootContext)
  const { abs } = useContext(absContext)
  const { abs: currentRouterAbs = abs } = useContext(routerContext)

  const getAbs = (to) => (this && this instanceof Router) || (typeof to === 'string' && /^\.\.?\/[a-z]/.test(to)) ? abs : currentRouterAbs
  const navigateTo = useRouteNavigate.call(this)

  const args = useShallowLatest(params)
  const finalAbs = getAbs(to)

  const { href, navigate } = useMemo(() => {
    const href = typeof to === 'number' ? '#' : history.$makeUrl(to, finalAbs, mode, args)
    const navigate = () => navigateTo(to, args, replace)
    return { href, navigate }
  }, [to, args, mode, replace, finalAbs, history])

  return Router.$createLink({ ...attrs, href, open, navigate })
}

export function useRouteNavigate() {
  const forceUpdate = useForceUpdate()
  useHistoryListener(forceUpdate)

  const { history, mode } = useContext(rootContext)
  const { abs, deep } = useContext(absContext)
  const { abs: currentRouterAbs = abs, current } = useContext(routerContext)
  const inHost = this && this instanceof Router
  const router = inHost ? this : current

  const getAbs = (to) => inHost || (typeof to === 'string' && /^\.\.?\/[a-z]/.test(to)) ? abs : currentRouterAbs
  return Router.$createNavigate(history, getAbs, mode, { deep, router, inHost })
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

  const { path, params } = useContext(routeContext)
  const { abs, deep } = useContext(absContext)
  const { history, mode } = useContext(rootContext)

  const loc = {
    abs,
    deep,
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

/**
 * 基于路由快速获取一个拥有isRouteActive的组件，从而可以根据路由来实现一些特定效果
 * @param path
 * @param C
 * @param exact
 * @returns
 */
export function createRouteComponent(path, C, exact) {
  const {
    useMatch,
    useNavigate,
    useParams,
    Link: ThisLink,
  } = new Router({
    routes: [
      {
        path,
        component: () => null,
        exact,
      },
    ],
  })

  let from = ''

  function Outlet(props) {
    const match = useMatch()
    const isRouteActive = match(path)
    const inactiveRoute = useInactiveRoute()
    const params = useParams()

    return <C {...props} isRouteActive={isRouteActive} inactiveRoute={inactiveRoute} routeParams={params} />
  }

  function Link(props) {
    return <ThisLink {...props} to={path} />
  }

  function useActiveRoute() {
    const navigate = useNavigate()
    const { history } = useContext(rootContext)
    return (params, replace) => {
      from = history.loaction.href
      navigate(path, params, replace)
    }
  }

  function useIsRouteActive() {
    const match = useMatch()
    const { history, mode } = useContext(rootContext)
    const { abs } = useContext(absContext)

    if (from && path.indexOf('./') === 0) {
      const to = history.loaction.href
      const fromUrl = history.$parseUrl(from, abs, mode)
      const toUrl = history.$parseUrl(to, abs, mode)
      if (toUrl === resolveUrl(fromUrl, path)) {
        return true
      }
      return false
    }


    const isMatched = match(path)
    return isMatched
  }

  function useInactiveRoute() {
    const navigate = useNavigate()
    return () => {
      navigate(-1)
      from = ''
    }
  }

  return { Outlet, useActiveRoute, useInactiveRoute, Link, useIsRouteActive }
}

export function createRouteState(paths, exact) {
  const { useMatch: useRouteMatch, useParams, useNavigate } = new Router({
    routes: paths.map((path) => ({
      path,
      component: () => null,
      exact,
    })),
  })

  const stack = []

  function useActive() {
    const navigate = useNavigate()
    const { history } = useContext(rootContext)
    return (path, params, replace) => {
      stack.push(history.loaction.href)
      navigate(path, params, replace)
    }
  }

  function useInactive() {
    const navigate = useNavigate()
    return () => {
      navigate(-1)
      stack.pop()
    }
  }

  function useMatch() {
    const match = useRouteMatch()
    const { history, mode } = useContext(rootContext)
    const { abs } = useContext(absContext)

    return (path) => {
      if (stack.length && path.indexOf('./') === 0) {
        const to = history.loaction.href
        const fromUrl = history.$parseUrl(stack[0], abs, mode)
        const toUrl = history.$parseUrl(to, abs, mode)
        if (toUrl === resolveUrl(fromUrl, path)) {
          return true
        }
        return false
      }

      return match(path)
    }
  }

  return { useMatch, useParams, useActive, useInactive }
}

export function Route(props) {
  const { path, exact, render } = props

  const { useMatch, useParams } = useMemo(() => {
    const { useMatch, useParams } = createRouteState([path], exact)
    return { useMatch, useParams }
  }, [path])
  const match = useMatch()
  const params = useParams()
  return match(path) ? render(params) : null
}


/**
 * 基于全局注册的路由进行跳转
 * @returns
 */
export function usePermanentNavigate() {
  const { history, mode, options = {} } = useContext(rootContext)
  const { define = {} } = options
  const getPath = (name) => {
    if (name === '.') {
      return name
    }

    const path = define[name]
    if (!path) {
      console.error(`Global route ${name} is not defined.`)
      return
    }

    return path
  }
  return Router.$createPermanentNavigate(getPath, { history, mode })
}
