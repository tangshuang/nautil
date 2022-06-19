import { mixin } from 'ts-fns'
import { Linking, TouchableOpacity } from 'react-native'
import { Router, rootContext } from '../../lib/router/router.jsx'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useContext, useMemo } from 'react'

const { Provider } = rootContext
const Stack = createStackNavigator()

mixin(Router, class {
  static $createRootProvider(ctx, children, options) {
    const nextContext = useMemo(() => {
      const nextContext = { ...ctx }
      if (options.rootScreenPath) {
        nextContext.roots = options.rootScreenPath
      }
    }, [ctx])
    if (options.ignoreNavigationContainer) {
      return <Provider value={nextContext}>{children}</Provider>
    }
    return (
      <NavigationContainer>
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

  static $createNavigate(history, getAbs, mode, { deep, transition }) {
    const navigation = useNavigation()
    const rootOptions = useContext(rootContext)
    const { roots = [] } = rootOptions

    return (to, params, replace) => {
      // change history first to trigger update
      // notice all screen may be changed
      if (typeof to === 'number') {
        if (to < 0) {
          history.back()
        }
      }
      else {
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

        let params = info
        roots.forEach((name) => {
          params.screen = name
          params.params = {}
          params = params.params
        })
        deep.forEach(({ route }) => {
          const { path } = route
          params.screen = path
          params.params = {}
          params = params.params
        })

        if (replace) {
          navigation.replace(info)
          return
        }

        navigation.navigate(info)
      }
    }
  }

  render(component, props, context) {
    if (this.options.transition === 'stack') {
      return this.renderStack(component, props, context)
    }

    // 不使用转场动效
    const C = component
    return <C {...props} />
  }

  renderStack(C, props, { routes }) {
    const items = routes.filter(item => item.component)
    return (
      <Stack.Navigator>
        {items.map((item) => {
          const { path, component: C } = item
          return (
            <Stack.Screen key={path} name={path}>
              {() => <C {...props} />}
            </Stack.Screen>
          )
        })}
      </Stack.Navigator>
    )
  }
})

export { Router }
export default Router
