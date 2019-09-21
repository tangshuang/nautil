import Component from '../core/component.js'
import Navigation from '../core/navigation.js'
import Observer from './observer.jsx'
import React from 'react'
import { enumerate, ifexist, Any } from '../core/types.js'
import { isNumber, cloneElement, mapChildren, filterChildren } from '../core/utils.js'
import Text from '../components/text.jsx'
import Section from '../components/section.jsx'

export class Navigator extends Component {
  static props = {
    navigation: Navigation,
    dispatch: ifexist(Function),
  }

  onRender() {
    const pollute = (C) => {
      const { navigation } = this.attrs
      const originals = C.defaultProps
      const hasuse = originals || {}
      const willuse = { ...hasuse, navigation }
      C.defaultProps = willuse
      this['_' + C.name + 'DefaultProps'] = originals
    }

    pollute(Route)
    pollute(Navigate)
  }

  onRendered() {
    const unpollute = (C) => {
      const originals = this['_' + C.name + 'DefaultProps']
      C.defaultProps = originals
    }

    unpollute(Route)
    unpollute(Navigate)
  }

  render() {
    const { navigation, dispatch } = this.attrs

    const Page = () => {
      const { options, state, status } = navigation

      // i.e. current is parent.child.subchild
      let rootRoute = state.route
      while (rootRoute && rootRoute.parent) {
        rootRoute = rootRoute.parent
      }

      // use notFoundComponent
      const { notFoundComponent: NotFound } = options
      if (!status && NotFound) {
        return <NotFound navigation={navigation} />
      }

      // when use inside component
      if (rootRoute) {
        const RouteComponent = rootRoute.component
        if (status && RouteComponent) {
          return <RouteComponent navigation={navigation} />
        }
      }

      return filterChildren(this.children)
    }

    const update = dispatch ? dispatch : this.update
    const page = Page()

    return (
      <Observer subscribe={dispatch => navigation.on('*', dispatch)} unsubscribe={dispatch => navigation.off('*', dispatch)} dispatch={update}>
        {page}
      </Observer>
    )
  }
}

export default Navigator

export class Route extends Component {
  static props = {
    navigation: Navigation,
    match: Any,
    exact: Boolean,
  }
  static defaultProps = {
    exact: false,
  }
  render() {
    const { navigation, match, exact, component, props = {} } = this.attrs
    if (navigation.test(match, exact)) {
      const RouteComponent = component
      if (RouteComponent) {
        return <RouteComponent navigation={navigation} {...props} />
      }
      else {
        return filterChildren(this.children)
      }
    }
    else {
      return null
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
    const { to, params, replace, open, navigation, component, ...props } = this.attrs
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
      return <C {...props} onHintEnd={go}>{nodes}</C>
    }
    else {
      return mapChildren(nodes, (child) => {
        if (child.type) {
          return cloneElement(child, { onHintEnd: go })
        }
        else {
          return <Text {...props} onHintEnd={go}>{child}</Text>
        }
      })
    }
  }
}
