import { enumerate } from 'tyshemo'
import { isNumber } from 'ts-fns'

import Component from '../component.js'
import Navigation from './navigation.js'

import { Consumer } from './context.js'
import { decorate } from '../operators/operators.js'

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

  render() {
    const { navigation } = this.attrs
    return (
      <Observer subscribe={dispatch => navigation.on('$change', dispatch)} unsubscribe={dispatch => navigation.off('$change', dispatch)} dispatch={this.weakUpdate}>
        {this.$render()}
      </Observer>
    )
  }

  $render() {
    throw new Error('Link $render method should be overrided.')
  }
}

export const Link = decorate(Consumer, ['navigation'])(_Link)
export default Link
