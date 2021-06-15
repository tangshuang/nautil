import { ifexist } from 'tyshemo'
import { isFunction, isObject, isInstanceOf } from 'ts-fns'

import Component from '../component.js'
import Navigation from './navigation.js'
import { pipe } from '../operators/combiners.js'
import { pollute } from '../operators/operators.js'
import Observer from '../components/observer.jsx'

import { _Route } from './route.jsx'
import { _Navigate } from './navigate.jsx'
import { _Link } from './link.jsx'

/**
 * @example use children
 * <Navigator navigation={navigation} dispatch={this.weakUpdate}>
 *   <_Route match="home" component={Home} props={{ title: 'Home Page' }} />
 *   <_Route match="page1" component={Page1} props={{ title: 'Page1' }} />
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
class _Navigator extends Component {
  static props = {
    navigation: Navigation,
    dispatch: ifexist(Function),

    // whether to use components inside navigation instance,
    // if false, will use children Route, dispatch should be set
    inside: ifexist(Boolean),
  }

  render() {
    const { navigation, dispatch, inside } = this.attrs
    const { options } = navigation

    const createRoutes = () => {
      const { notFound, routes } = options
      const views = routes.map((route) => {
        const { component, props = {}, animation = 0, name } = route
        return component ? <_Route key={name} component={component} match={name} navigation={navigation} animation={animation} {...props} /> : null
      })
      if (notFound) {
        if (isObject(notFound) && notFound.component) {
          const { component, props = {}, animation = 0 } = notFound
          const not = <_Route key="!" match="!" component={component} navigation={navigation} animation={animation} {...props} />
          views.push(not)
        }
        else if (isInstanceOf(notFound, Component) || isFunction(notFound)) {
          const not = <_Route key="!" match="!" component={notFound} navigation={navigation} />
          views.push(not)
        }
      }
      return views
    }

    const children = this.children
    const update = dispatch ? dispatch : this.weakUpdate

    let layout = null
    if (inside) {
      const views = createRoutes()
      layout = views
    }
    else if (isFunction(children)) {
      layout = children(navigation)
    }
    else {
      layout = children
    }

    return (
      <Observer subscribe={dispatch => navigation.on('*', dispatch)} unsubscribe={dispatch => navigation.off('*', dispatch)} dispatch={update}>
        {layout}
      </Observer>
    )
  }
}

export const Navigator = pipe([
  pollute(_Route, ({ navigation }) => ({ navigation })),
  pollute(_Navigate, ({ navigation }) => ({ navigation })),
  pollute(_Link, ({ navigation }) => ({ navigation })),
])(_Navigator)

export default Navigator
