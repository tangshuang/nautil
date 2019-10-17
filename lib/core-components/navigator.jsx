import Component from '../core/component.js'
import Navigation from '../core/navigation.js'
import Observer from './observer.jsx'
import React from 'react'
import { enumerate, ifexist, Any } from '../core/types.js'
import { isNumber, cloneElement, mapChildren, filterChildren, isFunction } from '../core/utils.js'
import Text from '../components/text.jsx'
import Section from '../components/section.jsx'
import { createPollutedComponent } from '../core/_generators.js'

const PollutedComponent = createPollutedComponent([
  { component: Route, pollute: ({ navigation }) => ({ navigation }), type: 'pollutedProps' },
  { component: Navigate, pollute: ({ navigation }) => ({ navigation }), type: 'pollutedProps' },
])

/**
 * @example use children
 * <Navigator navigation={navigation} dispatch={this.update}>
 *   <Route match="home" component={Home} props={{ title: 'Home Page' }} />
 *   <Route match="page1" component={Page1} props={{ title: 'Page1' }} />
 * </Navigator>
 *
 * @example I use Route directly previously, in fact, Route can be use anywhere inside Navigator
 * <Navigator navigation={navigation} dispatch={this.update}>
 *   <Page1 title="Page1" />
 * </Navigator>
 *
 * @example use components inside navigation
 * <Navigator navigation={navigation} inside />
 */
class Navigator extends PollutedComponent {
  static props = {
    navigation: Navigation,
    dispatch: ifexist(Function),

    // whether to use components inside navigation instance,
    // if false, will use children Route, dispatch should be set
    inside: ifexist(Boolean),
  }

  render() {
    const { navigation, dispatch, inside } = this.attrs
    const { options, state, status } = navigation

    const createRoute = () => {
      // not ready
      if (status < 0) {
        return null
      }

      // not found
      if (status === 0) {
        const { notFoundComponent: NotFound } = options
        if (NotFound) {
          return <NotFound navigation={navigation} />
        }
        else {
          return null
        }
      }

      let rootRoute = state.route
      while (rootRoute && rootRoute.parent) {
        rootRoute = rootRoute.parent
      }

      // when use inside component
      if (rootRoute) {
        const { component, props = {}, animation = 0, name } = rootRoute
        if (component) {
          return <Route component={component} match={name} navigation={navigation} animation={animation} {...props} />
        }
        else {
          return null
        }
      }

      return null
    }

    const children = this.children
    const update = dispatch ? dispatch : this.update
    const route = inside ? (isFunction(children) ? children(navigation) : children) : createRoute()

    return (
      <Observer subscribe={dispatch => navigation.on('*', dispatch)} unsubscribe={dispatch => navigation.off('*', dispatch)} dispatch={update}>
        {route}
      </Observer>
    )
  }
}

export class Route extends Component {
  static props = {
    navigation: Navigation,
    match: Any,
    exact: ifexist(Boolean),
    animation: ifexist(Number),
  }

  state = {
    show: false,
    display: false,
  }

  toggle() {
    const { navigation, match, exact, animation } = this.attrs
    const { show, display } = this.state
    const matched = navigation.is(match, exact)
    if (animation) {
      if (matched && !display) {
        clearTimeout(this.timer)
        this.setState({ display: true, show: false })
        this.timer = setTimeout(() => this.setState({ show: true }), 10)
      }
      else if (!matched && show) {
        clearTimeout(this.timer)
        this.setState({ show: false })
        this.timer = setTimeout(() => this.setState({ display: false }), animation)
      }
    }
    else {
      if (matched && !display) {
        this.setState({ display: true, show: true })
      }
      else if (!matched && show) {
        this.setState({ display: false, show: false })
      }
    }
  }
  onMounted() {
    this.toggle()
  }
  onUpdated() {
    this.toggle()
  }

  render() {
    const { navigation, component, props = {} } = this.attrs
    const { show, display } = this.state

    if (!display) {
      return null
    }

    const children = filterChildren(this.children)
    const RouteComponent = component
    if (RouteComponent) {
      return <RouteComponent show={show} {...props}>{children}</RouteComponent>
    }
    else if (isFunction(this.children)) {
      return this.children({ navigation, show })
    }
    else if (children.length) {
      return children
    }
    else {
      const { route } = navigation.state
      const { component: RouteComponent, props = {} } = route
      return RouteComponent ? <RouteComponent navigation={navigation} show={show} {...props} /> : null
    }
  }
}

export class Navigate extends Component {
  static props = {
    navigation: Navigation,
    to: enumerate([String, Number]),
    params: Object,
    replace: Boolean,
    open: Boolean,
  }
  static defaultProps = {
    params: {},
    replace: false,
    open: false,
  }

  render() {
    const { to, params, replace, open, navigation, component, props = {} } = this.attrs
    const { children } = this

    const go = () => {
      if (isNumber(to) && to < 0) {
        navigation.back(to)
      }
      else if (open) {
        navigation.open(to, params)
      }
      else {
        navigation.go(to, params, replace)
      }
    }

    const nodes = filterChildren(children)
    if (component || nodes.length > 1) {
      const C = component || Section
      return <C {...props} onHint={go}>{nodes}</C>
    }
    else {
      return mapChildren(nodes, (child) => {
        if (child.type) {
          return cloneElement(child, { onHint: go })
        }
        else {
          return <Text {...props} onHint={go}>{child}</Text>
        }
      })
    }
  }
}

export default Navigator
