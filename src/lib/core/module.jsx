import { Component } from './component.js'
import { createContext, useContext, useMemo, useEffect, useRef } from 'react'
import { RouterRootProvider, useRouteLocation, useRouteParams } from '../router/router.jsx'
import { I18nRootProvider } from '../i18n/i18n.jsx'
import { Ty, ifexist } from 'tyshemo'
import { useShallowLatest } from '../hooks/shallow-latest.js'
import { useForceUpdate } from '../hooks/force-update.js'
import { findInfoByMapping } from '../utils.js'

export class ModuleBaseComponent extends Component {}

const bootstrapperContext = createContext()
export function createBootstrap(options) {
  const { router, context = {}, i18n = {} } = options

  function Root(props) {
    const { children } = props
    const parent = useContext(bootstrapperContext)
    if (parent) {
      throw new Error('You should must use createBootstrap for your root application component only once.')
    }

    const { Provider } = bootstrapperContext
    return (
      <Provider value={context}>
        <I18nRootProvider language={i18n.language}>
          <RouterRootProvider value={router}>{children}</RouterRootProvider>
        </I18nRootProvider>
      </Provider>
    )
  }

  function bootstrap(C) {
    return function Bootstrapper(props) {
      return (
        <Root>
          <C {...props} />
        </Root>
      )
    }
  }

  bootstrap.Root = Root

  return bootstrap
}

const navigatorContext = createContext([])
const contextContext = createContext({})
const i18nContext = createContext()
const paramsContext = createContext({})

export function importModule(options) {
  const {
    prefetch,
    source,
    pending,
    name,
    navigator: needNavigator = true,
    context: sharedContext = {},
    ready: needReady = true,
  } = options

  let loadedComponent = null
  let loadedNavigator = null
  let loadedContext = null
  let loadedReady = null
  let loadedI18n = null
  let loadedParams = null

  class ModuleComponent extends ModuleBaseComponent {
    state = {
      component: loadedComponent,
      navigator: loadedNavigator,
      context: loadedContext,
      ready: loadedReady,
      i18n: loadedI18n,
      params: loadedParams,
    }

    prefetchLinks = []

    __init() {
      if (name) {
        this.name = name
      }
    }

    componentDidMount() {
      if (!loadedComponent) {
        // 拉取组件
        Promise.resolve(typeof source === 'function' ? source(this.props) : source)
          .then((mod) => {
            const { default: component, navigator, context, ready, i18n, params } = mod
            loadedComponent = component
            loadedNavigator = navigator
            loadedContext = context
            loadedReady = ready
            loadedI18n = i18n
            loadedParams = params
            this.setState({ component, navigator, context, ready, i18n, params })
          })
        // 预加载
        if (prefetch && document) {
          const urls = prefetch(this.props)
          urls.forEach((url) => {
            const link = document.createElement('link')
            link.rel = 'prefetch'
            link.as = 'fetch'
            link.href = url
            document.head.appendChild(link)
            this.prefetchLinks.push(link)
          })
        }
      }
    }

    componentWillUnmount() {
      if (this.prefetchLinks.length && document) {
        this.prefetchLinks.forEach((link) => {
          document.head.removeChild(link)
        })
      }
    }

    Within = () => {
      const {
        component,
        navigator: useThisNavigator,
        context: useThisContext,
        ready: useThisReady,
        i18n: useThisI18n,
        params: useThisParams,
      } = this.state

      const info = useRef({
        navigator: [],
        context: {},
        params: {},
        props: this.props,
      })
      info.current.props = this.props

      // compute current module navigator
      const previousNaivgators = useContext(navigatorContext)
      const previous = useShallowLatest(previousNaivgators)
      const { abs } = useRouteLocation()
      const navi = useThisNavigator ? useThisNavigator(info.current) : null
      const nav = useShallowLatest(navi)
      const navs = useMemo(() => {
        if (!nav) {
          return []
        }
        const navs = [].concat(nav)
        return navs.map((nav) => {
          if (typeof nav.path === 'undefined') {
            return {
              path: abs || '/',
              ...nav,
            }
          }
          return nav
        })
      }, [nav, abs])
      const navigator = useMemo(() => [...previous, ...navs], [navs, previous])
      info.current.navigator = navigator

      // get i18n
      const i18n = useThisI18n ? useThisI18n(info.current) : null
      info.i18n = i18n

      const paramsMapping = useThisParams ? useThisParams(info.current) : {}
      const routeParams = useRouteParams()
      const { found: paramsFound, notFound: paramsNotFound } = findInfoByMapping(routeParams, paramsMapping)
      const params = { ...routeParams, ...paramsFound }
      if (paramsNotFound.length && process.env.NODE_ENV !== 'production') {
        console.error(`Module not found: ${paramsNotFound.join(',')}`)
      }
      info.current.params = params

      // compute current module context
      const rootContext = useContext(bootstrapperContext)
      const thisContext = useThisContext ? useThisContext(info.current) : {}
      const parentContext = useContext(contextContext)
      const context = { ...rootContext, ...sharedContext, ...parentContext, ...thisContext }
      const ctx = useShallowLatest(context)
      info.current.context = ctx

      // deal with ready
      const ready = useThisReady && needReady ? useThisReady(info.current) : true
      if (!ready && !pending) {
        return null
      }
      if (!ready && pending) {
        return pending(this.props)
      }

      const { Provider: NavigatorProvider } = navigatorContext
      const { Provider: ContextProvider } = contextContext
      const { Provider: I18nProvider } = i18nContext
      const { Provider: ParamsProvider } = paramsContext

      const LoadedComponent = component

      const render = () => (
        <ContextProvider value={ctx}>
          <I18nProvider value={i18n}>
            <ParamsProvider value={params}>
              <LoadedComponent {...this.props} />
            </ParamsProvider>
          </I18nProvider>
        </ContextProvider>
      )

      if (!needNavigator) {
        return render()
      }

      return (
        <NavigatorProvider value={navigator}>
          {render()}
        </NavigatorProvider>
      )
    }

    render() {
      const { component } = this.state

      if (!component && !pending) {
        return null
      }

      if (!component && pending) {
        return pending(this.props)
      }

      const { Within } = this
      return <Within />
    }
  }

  return ModuleComponent
}

export function createAsyncComponent(source) {
  return importModule({ source, navigator: false })
}

export function useModuleNavigator() {
  const navigators = useContext(navigatorContext)
  if (process.env.NODE_ENV !== 'production') {
    Ty.expect(navigators).to.be([{
      title: ifexist(String),
      path: String,
    }])
  }
  return navigators
}

export function useModuleContext() {
  const ctx = useContext(contextContext)
  return ctx
}

export function useModuleI18n() {
  const i18n = useContext(i18nContext)
  const forceUpdate = useForceUpdate()
  useEffect(() => {
    i18n.on('changeLanguage', forceUpdate)
    i18n.on('changeResources', forceUpdate)
    return () => {
      i18n.off('changeLanguage', forceUpdate)
      i18n.off('changeResources', forceUpdate)
    }
  }, [i18n])
  return i18n
}

export function useModuleParams() {
  const params = useContext(paramsContext)
  return params
}
