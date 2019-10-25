import Component from '../core/component.js'
import Navigation from '../core/navigation.js'
import Observer from './observer.jsx'
import React from 'react'
import { enumerate, ifexist, Any } from '../core/types.js'
import { isNumber, cloneElement, mapChildren, filterChildren, isFunction, isObject, isInstanceOf } from '../core/utils.js'
import Text from '../components/text.jsx'
import Section from '../components/section.jsx'

export class Route extends Component {
  static props = {
    navigation: Navigation,
    match: Any,
    exact: ifexist(Boolean),
    animation: ifexist(Number),
  }

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      display: false,
    }
    this._isMounted = false
  }

  toggle() {
    const { navigation, match, exact, animation } = this.attrs
    const matched = navigation.is(match, exact)
    const { show, display } = this.state
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
    this._isMounted = true
  }
  onUpdated() {
    this.toggle()
  }

  render() {
    const { navigation, component, props = {}, match, exact } = this.attrs
    const { show, display } = this.state
    const matched = navigation.is(match, exact)

    // in SSR, the first time render should not use sync-render
    if (this._isMounted) {
      if (!display) {
        return null
      }
    }
    else if (!matched) {
      return null
    }

    const children = filterChildren(this.children)
    if (component) {
      const RouteComponent = component
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

  _wrapLink(child, props, go) {
    if (process.env.RUNTIME_ENV === 'dom' || process.env.RUNTIME_ENV === 'ssr-server' || process.env.RUNTIME_ENV === 'ssr-client') {
      const { navigation } = this.attrs
      const url = navigation.getUrl()
      return <a href={url} onClick={e => (go(), e.preventDefault(), false)} {...props}>{child}</a>
    }
    else {
      return <Text {...props} onHint={go}>{child}</Text>
    }
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
          return this._wrapLink(child, props, go)
        }
      })
    }
  }
}

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
export class Navigator extends Component {
  static props = {
    navigation: Navigation,
    dispatch: ifexist(Function),

    // whether to use components inside navigation instance,
    // if false, will use children Route, dispatch should be set
    inside: ifexist(Boolean),
  }

  onInit() {
    const { navigation } = this.props
    const props = { navigation }
    this._pollutedComponents = [
      { component: Route, props },
      { component: Navigate, props },
    ]

    // in SSR, render is sync, fiber is useless,
    // we can just pollute components before they initialize
    if (process.env.RUNTIME_ENV === 'ssr-server') {
      {
        const { defaultProps = {} } = Route
        Route.defaultProps = {
          ...props,
          ...defaultProps,
        }
      }
      {
        const { defaultProps = {} } = Navigate
        Navigate.defaultProps = {
          ...props,
          ...defaultProps,
        }
      }
    }
  }

  render() {
    const { navigation, dispatch, inside } = this.attrs
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
    const update = dispatch ? dispatch : this.update

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

export default Navigator
