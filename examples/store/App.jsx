import { Component, Store, Provider, Observer } from 'nautil'
import Page1 from './pages/Page1.jsx'

const store = new Store({
  name: 'tomy',
  age: 10,
})

export class App extends Component {
  render() {
    return (
      <Observer subscribe={dispatch => store.watch('*', dispatch)}>
        <Provider $state={store.state}>
          <Page1 />
        </Provider>
      </Observer>
    )
  }
}
export default App
