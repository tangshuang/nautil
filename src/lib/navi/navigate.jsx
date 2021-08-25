import { ifexist } from 'tyshemo'

import Navigation from './navigation.js'
import Component from '../component.js'
import { Observer } from '../components/observer.jsx'

import { Consumer } from './context.js'

export class Navigate extends Component {
  static props = {
    navigation: ifexist(Navigation),
    map: ifexist(Function),
    render: ifexist(Function),
    static: ifexist(Boolean),
  }

  static defaultProps = {
    static: true,
  }

  shouldUpdate() {
    if (this.attrs.static) {
      return false
    }
    return true
  }

  render() {
    return (
      <Consumer>
        {(provided) => {
          const { navigation, map, render, static: isStatic } = this.attrs
          const fn = render ? render : this.children
          const navi = navigation || provided
          const data = map ? map(navi) : navi
          const output = fn(data)

          if (isStatic) {
            return (
              <Observer subscribe={dispatch => navi.on('$change', dispatch)} unsubscribe={dispatch => navi.off('$change', dispatch)} dispatch={this.forceUpdate}>
                {output}
              </Observer>
            )
          }

          return output
        }}
      </Consumer>
    )
  }
}

export default Navigate
