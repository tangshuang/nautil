import { Component, Store, Provider, ObservableProvider } from 'nautil'
import Page1 from './pages/Page1.jsx'
import Page2 from './pages/Page2.jsx'

const store = new Store({
  name: 'tomy',
  age: 10,
})

export class App extends Component {
  render() {
    return (
      <ObservableProvider
        name="$state" value={store.state}
        subscribe={dispatch => store.watch('*', dispatch)} dispatch={this.update}
      >
        <Page1 />
        <Page2 />
      </ObservableProvider>
    )
  }
}
export default App
