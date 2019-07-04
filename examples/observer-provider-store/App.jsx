import { Component, Store, Provider, Observer } from 'nautil'
import Page1 from './pages/Page1.jsx'
import Page2 from './pages/Page2.jsx'

const store = new Store({
  name: 'tomy',
  age: 10,
})

export class App extends Component {
  render() {
    return (
      <Observer subscribe={dispatch => store.watch('*', dispatch)} dispatch={() => this.forceUpdate()}>
        <Provider name="state" value={store.state}>
          <Page1 />
          <Page2 />
        </Provider>
      </Observer>
    )
  }
}
export default App
