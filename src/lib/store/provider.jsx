import Component from '../core/component.js'
import Store from './store.js'
import Consumer from './consumer.jsx'
import { pollute } from '../core/operators/operators.js'

class _Provider extends Component {
  static props = {
    store: Store,
  }

  render() {
    return this.children
  }
}

export const Provider = pollute(Consumer, ({ store }) => {
  return { store }
})(_Provider)

export default Provider
