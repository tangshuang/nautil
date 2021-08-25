import Component from '../component.js'
import Store from './store.js'

import { Provider as ContextProvider } from './context.js'

export class Provider extends Component {
  static props = {
    store: Store,
  }

  render() {
    const { store } = this.props
    return (
      <ContextProvider value={store}>
        {this.children}
      </ContextProvider>
    )
  }
}

export default Provider
