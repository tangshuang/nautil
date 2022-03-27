import { Component } from './component.js'
import { createContext, useContext, useMemo, useState } from 'react'
import { RouterRootProvider, useRouteLocation } from '../router/router.jsx'
import { I18nProvider } from '../i18n/i18n.jsx'
import { Ty, ifexist } from 'tyshemo'
import { useShallowLatest } from '../hooks/shallow-latest.js'

const bootstrapperContext = createContext()
export function createBootstrap(options) {
  const { router, i18n } = options
  return function(C) {
    return function Bootstrapper(props) {
      const parent = useContext(bootstrapperContext)
      if (parent) {
        throw new Error('You should must use createBootstrap for your root application component only once.')
      }

      const { Provider } = bootstrapperContext
      return (
        <Provider value={true}>
          <RouterRootProvider value={router}>
            <I18nProvider value={i18n}>
              <C {...props} />
            </I18nProvider>
          </RouterRootProvider>
        </Provider>
      )
    }
  }
}

const navigatorContext = createContext([])
const contextContext = createContext({})

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
  let loadedContext = {}
  let loadedReady = null

  class ModuleComponent extends Component {
    state = {
      component: loadedComponent,
      navigator: loadedNavigator,
      context: loadedContext,
      ready: loadedReady,
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
        Promise.resolve(source(this.props))
          .then((mod) => {
            const { default: component, navigator, context, ready } = mod
            loadedComponent = component
            loadedNavigator = navigator
            loadedContext = context
            loadedReady = ready
            this.setState({ component, navigator, context, ready })
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
      // compute current module navigator
      const previousNaivgators = useContext(navigatorContext)
      const previous = useShallowLatest(previousNaivgators)
      const {
        navigator: useThisNavigator,
        component,
        context: useThisContext,
        ready: useThisReady,
      } = this.state
      const { abs } = useRouteLocation()
      const navigator = useThisNavigator ? useThisNavigator(this.props) : {}
      const nav = useShallowLatest(navigator)
      const navi = useMemo(() => {
        if (!nav.path) {
          return {
            ...nav,
            path: abs,
          }
        }
        return nav
      }, [nav, abs])
      const navigators = useMemo(() => [...previous, navi], [navi, previous])

      // compute current module context
      const thisContext = useThisContext ? useThisContext(this.props) : {}
      const context = { ...sharedContext, ...thisContext }
      const ctx = useShallowLatest(context)

      // deal with ready
      const ready = useThisReady && needReady ? useThisReady(this.props) : true
      if (!ready && !pending) {
        return null
      }
      if (!ready && pending) {
        return pending(this.props)
      }

      const { Provider: NavigatorProvider } = navigatorContext
      const { Provider: ContextProvider } = contextContext
      const LoadedComponent = component

      const render = () => (
        <ContextProvider value={ctx}>
          <LoadedComponent {...this.props} />
        </ContextProvider>
      )

      if (!needNavigator) {
        return render()
      }

      return (
        <NavigatorProvider value={navigators}>
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
