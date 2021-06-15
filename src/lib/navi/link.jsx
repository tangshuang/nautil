import { enumerate } from 'tyshemo'
import { isNumber } from 'ts-fns'

import Component from '../component.js'
import Navigation from './navigation.js'

export class _Link extends Component {
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

  getHref() {
    const { to, params, navigation } = this.attrs
    const state = navigation.makeState(to, params)
    const href = navigation.makeHref(state)
    return href
  }

  goto() {
    const { to, params, replace, open, navigation } = this.attrs

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
}

export class Link extends Component {
  render() {
    return <_Link {...this.props} />
  }
}

export default Link
