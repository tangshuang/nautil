import Component from '../core/component.js'
import Navigation from '../core/navigation.js'
import Observer from './observer.jsx'
import React from 'react'
import { enumerate, ifexist } from '../core/types.js'
import { isNumber, cloneElement, mapChildren, filterChildren } from '../core/utils.js'
import Text from '../components/text.jsx'
import Section from '../components/section.jsx'

export class Navigator extends Component {
  static props = {
    navigation: Navigation,
    dispatch: ifexist(Function),
  }

  onRender() {
    const { navigation } = this.attrs
    const originals = Navigate.defaultProps
    const hasuse = originals || {}
    const willuse = { ...hasuse, navigation }
    Navigate.defaultProps = willuse
    this._NavigateDefaultProps = originals
  }

  onRendered() {
    const originals = this._NavigateDefaultProps
    Navigate.defaultProps = originals
  }

  render() {
    const { navigation, dispatch } = this.attrs

    const Page = () => {
      const { options, status, state } = navigation
      const isInside = options.routes.find(item => item.component)
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
    const { to, params, replace, open, navigation, component, children, ...props } = this.props

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
