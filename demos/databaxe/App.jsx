import { React, Component, Provider, DataBaxe } from 'nautil'
import Page1 from './pages/page1.jsx'

const datasources = []

const databaxe = new DataBaxe({
  expire: 10000,
})

databaxe.register(datasources)

class App extends Component {
  render() {
    return <Provider $databaxe={databaxe}>
      <Page1 />
    </Provider>
  }
}