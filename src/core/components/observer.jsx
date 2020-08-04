import { ifexist, Ty } from 'tyshemo'

import Component from '../component.js'
import { noop } from '../utils.js'

export class Observer extends Component {
  static props = {
    subscribe: Function,
    unsubscribe: ifexist(Function),
    dispatch: Function,
  }
  static defaultProps = {
    unsubscribe: noop,
  }

  onMounted() {
    const { subscribe, dispatch } = this.attrs
    this._unsubscribe = subscribe(dispatch)
  }

  onUnmount() {
    const { unsubscribe = this._unsubscribe, dispatch } = this.attrs
    if (process.env.NODE_ENV !== 'production') {
      Ty.expect(unsubscribe).to.be(Function)
    }
    unsubscribe(dispatch)
  }

  render() {
    return this.children
  }
}
export default Observer
