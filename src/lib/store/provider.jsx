import Component from '../core/component.js'
import Store from './store.js'
import { pollute } from '../core/operators/operators.js'

import { _Consumer} from './consumer.jsx'

class _Provider extends Component {
  static props = {
    store: Store,
  }

  render() {
    return this.children
  }
}

export const Provider = pollute(_Consumer, ({ store }) => {
  return { store }
})(_Provider)

export default Provider
