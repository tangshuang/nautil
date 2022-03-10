import { ifexist, Ty } from 'tyshemo'

import Component from '../core/component.js'
import { noop } from '../utils.js'
import { isFunction } from 'ts-fns'

export class Observer extends Component {
  static props = {
    subscribe: Function,
    unsubscribe: ifexist(Function),
    dispatch: ifexist(Function),
    render: ifexist(Function),
  }
  static defaultProps = {
    unsubscribe: noop,
  }

  onMounted() {
    const { subscribe, dispatch = this.weakUpdate } = this.attrs
    this._unsubscribe = subscribe(dispatch)
  }

  onUnmount() {
    const { unsubscribe = this._unsubscribe, dispatch = this.weakUpdate } = this.attrs
    if (process.env.NODE_ENV !== 'production') {
      Ty.expect(unsubscribe).to.be(Function)
    }
    unsubscribe(dispatch)
  }

  render() {
    const { render } = this.attrs
    if (isFunction(render)) {
      return render()
    }
    else if (isFunction(this.children)) {
      return this.children()
    }
    else {
      return this.children
    }
  }
}
export default Observer
