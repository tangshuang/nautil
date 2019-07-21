import Component from '../core/component.js'
import Navigation from '../core/navigation.js'
import Observer from './observer.jsx'
import React from 'react'
import { enumerate, ifexist } from '../core/types.js'
import { isNumber, cloneElement, mapChildren } from '../core/utils.js'
import Text from '../components/text.jsx'

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
      let output = null

      if (isInside) {
        output = status === '!' ? notFound ? <notFound /> : null
          : status !== '' ? state.route.component ? <state.route.component /> : null
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
    const { to, params, replace, open, navigation, component } = this.attrs
    const children = this.children

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

    return mapChildren(children, (child) => {
      if (!child.type) {
        const C = component || Text
        return <C onHintEnd={go}>{child}</C>
      }
      else {
        return cloneElement(child, { onHintEnd: go })
      }
    })
  }
}
