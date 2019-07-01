import { React, Component, Provider, Observer, Depository } from 'nautil'
import Page1 from './pages/page1.jsx'

const datasources = []

const depo = new Depository({
  expire: 10000,
})

depo.register(datasources)

export class App extends Component {
  render() {
    return (
      <Observer subscribe={dispatch => depo.subscribe('some', dispatch).subscribe('tag', dispatch)}>
        <Provider $depo={depo}>
          <Page1 />
        </Provider>
      </Observer>
    )
  }
}

export default App
