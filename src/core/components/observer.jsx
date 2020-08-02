import Component from '../core/component.js'
import { noop } from '../utils.js'

export class Observer extends Component {
  static props = {
    subscribe: Function,
    unsubscribe: Function,
    dispatch: Function,
  }
  static defaultProps = {
    unsubscribe: noop,
  }
  onMounted() {
    const { subscribe, dispatch } = this.attrs
    subscribe(dispatch)
  }
  onUnmount() {
    const { unsubscribe, dispatch } = this.attrs
    unsubscribe(dispatch)
  }
  render() {
    return this.children
  }
}
export default Observer
