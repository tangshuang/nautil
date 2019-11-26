import Component from '../core/component.js'
import { isFunction, createPlaceholderComponent, noop } from '../utils.js'
import { ifexist, Any } from '../core/types.js'

export class Await extends Component {
  static props = {
    placeholder: Any,
    then: ifexist(Function),
    catch: Function,
    promise: Promise,
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
    const { promise } = this.attrs
    promise.then((data) => {
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
    const { placeholder, then, catch: catchFn } = this.attrs
    const { status, data, error } = this.state

    if (status === 'pending') {
      return createPlaceholderComponent(placeholder)
    }
    else if (status === 'resolved') {
      return then ? then(data) : isFunction(this.children) ? this.children(data) : this.children
    }
    else if (status === 'rejected') {
      return catchFn ? catchFn(error) : null
    }
    else {
      return null
    }
  }
}
export default Await
