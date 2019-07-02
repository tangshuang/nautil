import { Component, Navigation, Navigator, Observer, Switch, Case } from 'nautil'
import Page1 from './pages/Page1.jsx'
import Page2 from './pages/Page2.jsx'

const navigation = new Navigation({
  base: '/app',
  mode: 'history',
  routes: [
    {
      name: 'home',
      url: '/',
      redirect: 'page1',
    },
    {
      name: 'page1',
      url: '/page1',
      params: {
        name: 'tomy',
      },
    },
    {
      name: 'page2',
      url: '/page2/:type/:id',
      // default params
      params: {
        type: 'animal',
      },
    },
  ],
})

function NotFound() {
  return <div>Not Found!</div>
}

export class App extends Component {
  render() {
    return (
      <Navigator navigation={navigation}>
        <Switch of={navigation.status}>
          <Case value="page1">
            <Page1></Page1>
          </Case>
          <Case value="page2">
            <Page2 type={navigation.state.params.type} id={navigation.state.params.id}></Page2>
          </Case>
          <Case default>
            <NotFound></NotFound>
          </Case>
        </Switch>
      </Navigator>
    )
  }
}
export default App
