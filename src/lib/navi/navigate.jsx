import React from 'react'
import { ifexist } from 'tyshemo'

import Navigation from './navigation.js'
import Component from '../component.js'

export class _Navigate extends Component {
  static props = {
    navigation: Navigation,
    map: ifexist(Function),
    render: ifexist(Function),
  }

  render() {
    const { navigation, map, render } = this.attrs
    const fn = render ? render : this.children
    const data = map ? map(navigation) : navigation
    return fn(data)
  }
}

export class Navigate extends Component {
  render() {
    return <_Navigate {...this.props} />
  }
}

export default Navigate
