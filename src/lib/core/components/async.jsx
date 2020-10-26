import { isFunction, ifexist, Any } from 'tyshemo'

import Component from '../component.js'
import { createPlaceholderComponent, noop } from '../utils.js'

export class Async extends Component {
  static props = {
    then: ifexist(Function),
    catch: Function,
    await: Function,
    pendding: Any,
    render: ifexist(Function),
  }
  static defaultProps = {
    catch: noop,
  }
  state = {
    status: 'pending',
    data: null,
    error: null,
  }
  onMounted() {
    const { await: fn } = this.attrs
    fn().then((data) => {
      if (this._isUnmounted) {
        return
      }
      this.setState({ status: 'resolved', data })
    }).catch((error) => {
      if (this._isUnmounted) {
        return
      }
      this.setState({ status: 'rejected', error })
    })
  }
  onUnmount() {
    this._isUnmounted = true
  }
  render() {
    const { pendding, then, catch: catchFn, render } = this.attrs
    const { status, data, error } = this.state

    if (status === 'pending') {
      return createPlaceholderComponent(pendding)
    }
    else if (status === 'resolved') {
      return then ? then(data) : isFunction(this.children) ? this.children(data)
        : render ? render(data)
        : this.children
    }
    else if (status === 'rejected') {
      return catchFn ? catchFn(error) : null
    }
    else {
      return null
    }
  }
}
export default Async
