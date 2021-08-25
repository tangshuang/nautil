import Component from '../component.js'
import Store from './store.js'

import { Provider } from './context.js'

export class Provider extends Component {
  static props = {
    store: Store,
  }

  render() {
    const { store } = this.props
    return (
      <Provider value={store}>
        {this.children}
      </Provider>
    )
  }
}

export default Provider
