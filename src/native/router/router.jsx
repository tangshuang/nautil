import { mixin } from 'ts-fns'
import { Linking, TouchableOpacity } from 'react-native'
import { Router, rootContext } from '../../lib/router/router.jsx'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useContext, useMemo } from 'react'

const { Provider } = rootContext

mixin(Router, class {
  static $createRootProvider(ctx, children, options) {
    const nextContext = useMemo(() => {
      const context = { ...ctx }
      if (options.rootScreenPath) {
        context.roots = options.rootScreenPath
      }
      return context
    }, [ctx])
    if (options.ignoreNavigationContainer) {
      return <Provider value={nextContext}>{children}</Provider>
    }
    const props = options.navigationContainerProps || {}
    return (
      <NavigationContainer {...props}>
        <Provider value={nextContext}>{children}</Provider>
      </NavigationContainer>
    )
  }

  static $createLink(data) {
    const { children, href, open, navigate, ...attrs } = data
    const handleClick = async () => {
      if (open) {
        const supported = await Linking.canOpenURL(href)
        if (!supported) {
          throw new Error(`not support open ${href}`)
        }
        await Linking.openURL(href)
      } else {
        navigate()
      }
    }
    return (
      <TouchableOpacity {...attrs} onPress={handleClick}>
        {children}
      </TouchableOpacity>
    )
  }

  static $createNavigate(history, getAbs, mode, { deep, router, inHost }) {
    const { transition, baseScreenPath = [] } = router.options
    const navigation = useNavigation()
    const {  options: { rootScreenPath = [] } } = useContext(rootContext)

    return (to, params, replace) => {
      // change history first to trigger update
      // notice all screen may be changed
      if (typeof to === 'number') {
        if (to < 0) {
          history.back()
        }
      } else {
        history.setUrl(to, getAbs(to, params), mode, params, replace)
      }

      // transition to next screen
      if (transition === 'stack') {
        if (typeof to === 'number') {
          if (to < 0) {
            navigation.goBack()
          }
          return
        }

        const info = {}

        let navParams = info
        ;[...rootScreenPath, ...baseScreenPath].forEach((name) => {
          navParams.screen = name
          navParams.params = {}
          navParams = navParams.params
        })
        const deepPath = deep.map(({ route }) => route.path || route.name)
        if (!inHost) {
          deepPath.pop() // remove the tail
        }
        deepPath.forEach(({ route }) => {
          const { path } = route
          navParams.screen = path
          navParams.params = {}
          navParams = navParams.params
        })

        navParams.screen = to

        if (replace) {
          navigation.replace(info.screen, info.params)
          return
        }

        navigation.navigate(info.screen, info.params)
      }
    }
  }

  init() {
    this.Stack = createStackNavigator(this.options.navigatorOptions)
  }

  render(component, props, context) {
    if (this.options.transition === 'stack') {
      return this.renderStack(component, props, context)
    }

    // 不使用转场动效
    const C = component
    return <C {...props} />
  }

  renderStack(_, props) {
    const { routes, options } = this
    const items = routes.filter((item) => item.component)
    const navigatorProps = options.navigatorProps || {}
    const { Stack } = this
    return (
      <Stack.Navigator {...navigatorProps}>
        {items.map((routeOptions) => {
          const { name, path = name, component: Comp, screenOptions = {} } = routeOptions
          return (
            <Stack.Screen key={path} name={path} options={screenOptions}>
              {() => <Comp {...props} />}
            </Stack.Screen>
          )
        })}
      </Stack.Navigator>
    )
  }
})

export { Router }
export default Router
