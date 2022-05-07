import { mixin, isShallowEqual } from 'ts-fns'
import { Linking, TouchableOpacity } from 'react-native'
import { Router, rootContext } from '../../lib/router/router.jsx'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

const { Provider } = rootContext
const Stack = createStackNavigator()

mixin(Router, class {
  static $createRootProvider(ctx, children) {
    return (
      <NavigationContainer>
        <Provider value={ctx}>{children}</Provider>
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

  static $createNavigate(history, abs, mode) {
    const navigation = useNavigation()

    return (to, params, replace) => {
      if (typeof to === 'number') {
        if (to < 0) {
          navigation.goBack()
        }
        return
      }

      const name = history.$makeUrl(to, abs, mode, params)
      if (replace) {
        navigation.reset({
          index: 0,
          routes: [{ name }],
        })
        return
      }

      navigation.navigate(name, params)
    }
  }

  init() {
    this.views = {}
  }

  render(component, props, context) {
    if (this.options.transition === 'stack') {
      return this.renderStack(component, props, context)
    }

    // 不使用转场动效
    const C = component
    return <C {...props} />
  }

  renderStack(C, props, { url, history, abs, mode, params }) {
    const name = history.$makeUrl(url, abs, mode, params)

    if (!this.views[name] || !isShallowEqual(this.views[name].props, props)) {
      this.views[name] = {
        screen: (
          <Stack.Screen key={name} name={name}>
            {() => <C {...props} />}
          </Stack.Screen>
        ),
        props,
      }
    }

    return <Stack.Navigator>{Object.keys(this.views).map((name) => this.views[name].screen)}</Stack.Navigator>
  }
})

export { Router }
export default Router
