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
      const { options, status, state, routes } = navigation
      const isInside = routes.find(item => item.component)
      const { notFound } = options
      const NotFound = notFound
      const RouteComponent = (state.route && state.route.component) || null
      let output = null

      if (isInside) {
        output = status === '!'
        ? NotFound ? <NotFound /> : null
        : status !== ''
          ? RouteComponent ? <RouteComponent /> : null
          : this.children
      }
      else {
        output = this.children
      }

      return output
    }

    const update = dispatch ? dispatch : this.update
    const page = Page()
    const children = page || null

    return (
      <Observer subscribe={dispatch => navigation.on('*', dispatch)} unsubscribe={dispatch => navigation.off('*', dispatch)} dispatch={update}>
        {children}
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
    base: ifexist(String),
  }
  static defaultProps = {
    exact: false,
  }
  render() {
    const { navigation, match, exact, base } = this.props
    const isMatched = (match, exact) => {
      const { status } = navigation
      if (match === '*') {
        return true
      }
      // i.e. on('book', callback)
      if (match === status) {
        return true
      }
      // i.e. on('parent.child', callback) and current parent.child.subchild
      if (status.indexOf(match + '.') === 0 && !exact) {
        return true
      }
      // i.e. on(/iii/g, callback)
      if (match instanceof RegExp && match.test(status)) {
        return true
      }
      // i.e. on(url => url.indexOf('http') === 0, callback)
      if (typeof match === 'function' && match(status)) {
        return true
      }
      return false
    }

    const path = base ? base + '.' + match : match
    if (isMatched(path, exact)) {
      return filterChildren(this.children)
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
    base: ifexist(String),
  }
  static defaultProps = {
    params: {},
    replace: false,
    open: false,
  }

  render() {
    const { to, params, replace, open, navigation, component, children, base, ...props } = this.props
    const path = base ? base + '.' + to : to

    const go = () => {
      if (isNumber(path) && path < 0) {
        navigation.back(path)
      }
      else if (open) {
        navigation.open(path, params)
      }
      else {
        navigation.go(path, params, replace)
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
