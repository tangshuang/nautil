import { ifexist } from 'tyshemo'
import { isFunction, isObject, isInstanceOf } from 'ts-fns'
import { createContext, useMemo } from 'react'

import Component from '../component.js'
import Navigation from './navigation.js'
import Observer from '../components/observer.jsx'
import { decorate } from '../operators/operators.js'

import { Route } from './route.jsx'
import { Provider } from './context.js'

const navigatorContext = createContext()

/**
 * @example use children
 * <Navigator navigation={navigation} dispatch={this.weakUpdate}>
 *   <Route match="home" component={Home} props={{ title: 'Home Page' }} />
 *   <Route match="page1" component={Page1} props={{ title: 'Page1' }} />
 * </Navigator>
 *
 * @example I use Route directly previously, in fact, Route can be use anywhere inside Navigator
 * <Navigator navigation={navigation} dispatch={this.weakUpdate}>
 *   <Page1 title="Page1" />
 * </Navigator>
 *
 * @example use components inside navigation
 * <Navigator navigation={navigation} inside />
 */
export class _Navigator extends Component {
  static props = {
    navigation: Navigation,
    dispatch: ifexist(Function),

    // whether to use components inside navigation instance,
    // if false, will use children Route, dispatch should be set
    inside: ifexist(Boolean),

    // that passed by top Consumer
    // you do not need to pass it by yourself
    abs: ifexist(String),
  }

  Render() {
    const { navigation, dispatch, inside, abs } = this.attrs
    const { options } = navigation

    const createRoutes = () => {
      const { notFound, routes } = options
      const views = routes.map((route) => {
        const { component, props = {}, animation = 0, name } = route
        return component ? <Route key={name} component={component} match={name} navigation={navigation} animation={animation} {...props} /> : null
      })
      if (notFound) {
        if (isObject(notFound) && notFound.component) {
          const { component, props = {}, animation = 0 } = notFound
          const not = <Route key="!" match="!" component={component} navigation={navigation} animation={animation} {...props} />
          views.push(not)
        }
        else if (isInstanceOf(notFound, Component) || isFunction(notFound)) {
          const not = <Route key="!" match="!" component={notFound} navigation={navigation} />
          views.push(not)
        }
      }
      return views
    }

    const children = this.children
    const update = dispatch ? dispatch : this.weakUpdate

    useMemo(() => {
      navigation.abs = abs
      navigation.reload()
    }, [abs])

    let layout = null
    if (inside || !children) {
      const views = createRoutes()
      layout = views
    }
    else if (isFunction(children)) {
      layout = children(navigation)
    }
    else {
      layout = children
    }

    const state = navigation.getState()
    const currPath = (abs || '') + (state ? state.path : '')
    const NProvider = navigatorContext.Provider

    return (
      <Provider value={navigation}>
        <NProvider value={currPath}>
          <Observer subscribe={dispatch => navigation.on('$change', dispatch)} unsubscribe={dispatch => navigation.off('$change', dispatch)} dispatch={update}>
            {layout}
          </Observer>
        </NProvider>
      </Provider>
    )
  }
}

const Navigator = decorate(navigatorContext.Consumer, ['abs'])(_Navigator)

export default Navigator
