import { enumerate, ifexist } from 'tyshemo'
import { isNumber } from 'ts-fns'

import Component from '../component.js'
import Navigation from './navigation.js'

import { Consumer } from './context.js'

export class Link extends Component {
  static props = {
    navigation: ifexist(Navigation),
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

  goto(provided) {
    const { to, params, replace, open, navigation } = this.attrs
    const navi = navigation || provided

    if (isNumber(to) && to < 0) {
      navi.back(to)
    }
    else if (open) {
      navi.open(to, params)
    }
    else {
      navi.go(to, params, replace)
    }
  }

  render() {
    return (
      <Consumer>
        {(provided) => {
          const { navigation } = this.attrs
          const navi = navigation || provided
          return (
            <Observer subscribe={dispatch => navi.on('$change', dispatch)} unsubscribe={dispatch => navi.off('$change', dispatch)} dispatch={this.weakUpdate}>
              {this.$render(navi)}
            </Observer>
          )
        }}
      </Consumer>
    )
  }

  $render() {
    throw new Error('Link $render method should be overrided.')
  }
}

export default Link
