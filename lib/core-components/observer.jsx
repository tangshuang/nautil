import Component from '../core/component.js'
import { isFunction } from '../core/utils.js'

export class Observer extends Component {
  static props = {
    subscribe: Function,
    unsubscribe: Function,
    dispatch: Function,
  }
  onMounted() {
    const { subscribe, dispatch } = this.attrs
    subscribe(dispatch)
  }
  onUnmount() {
    const { unsubscribe, dispatch } = this.attrs
    if (isFunction(unsubscribe)) {
      unsubscribe(dispatch)
    }
  }
  render() {
    return this.children
  }
}
export default Observer
