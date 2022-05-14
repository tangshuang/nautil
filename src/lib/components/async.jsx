import { ifexist, Any, Enum } from 'tyshemo'
import { isFunction } from 'ts-fns'

import Component from '../core/component.js'
import { createPlaceholderElement, noop } from '../utils.js'

export class Async extends Component {
  static props = {
    await: new Enum([Function, Promise]),
    then: ifexist(Function),
    catch: Function,
    pending: ifexist(Any),
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
    const deferer = isFunction(fn) ? fn() : fn
    deferer.then((data) => {
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
    const { pending, then, catch: catchFn } = this.attrs
    const { status, data, error } = this.state
    const inside = (data) => isFunction(this.children) ? this.children(data) : this.children

    if (status === 'pending') {
      return pending ? createPlaceholderElement(pending) : inside()
    }
    else if (status === 'resolved') {
      return then ? then(data) : inside(data)
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
