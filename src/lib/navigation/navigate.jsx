import { ifexist } from 'tyshemo'

import Navigation from './navigation.js'
import Component from '../component.js'
import { Observer } from '../components/observer.jsx'

import { Consumer } from './context.js'
import { decorate } from '../operators/operators.js'

class _Navigate extends Component {
  static props = {
    navigation: Navigation,
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
    const { navigation, map, render, static: isStatic } = this.attrs

    const gen = () => {
      const fn = render ? render : this.children
      const data = map ? map(navigation) : navigation
      const output = fn(data)
      return output
    }

    if (isStatic) {
      return (
        <Observer subscribe={dispatch => navigation.on('$change', dispatch)} unsubscribe={dispatch => navigation.off('$change', dispatch)} dispatch={this.forceUpdate}>
          {gen}
        </Observer>
      )
    }

    return gen()
  }
}

export const Navigate = decorate(Consumer, ['navigation'])(_Navigate)
export default Navigate
