import { ifexist } from 'tyshemo'

import Navigation from './navigation.js'
import Component from '../component.js'
import { Observer } from '../components/observer.jsx'

export class _Navigate extends Component {
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
    const { navigation, map, render, static } = this.attrs
    const fn = render ? render : this.children
    const data = map ? map(navigation) : navigation
    const output = fn(data)

    if (static) {
      return (
        <Observer subscribe={dispatch => navigation.on('$change', dispatch)} unsubscribe={dispatch => navigation.off('$change', dispatch)} dispatch={this.forceUpdate}>
          {output}
        </Observer>
      )
    }

    return output
  }
}

export class Navigate extends Component {
  render() {
    return <_Navigate {...this.props} />
  }
}

export default Navigate
