import { Component, Depository, ObservableProvider } from 'nautil'
import Page1 from './pages/page1.jsx'

const datasources = [
  // ...
]

const depo = new Depository({
  expire: 10000,
})

depo.register(datasources)

export class App extends Component {
  render() {
    return (
      <ObservableProvider
        name="$depo" value={depo}
        subscribe={dispatch => depo.subscribe('some', dispatch).subscribe('tag', dispatch)}
        dispatch={this.update}
      >
        <Page1 />
      </ObservableProvider>
    )
  }
}

export default App
