import { Component, Navigation, Navigator, Navigate, Observer, Provider, Store, Depository, Switch, Case } from '../index.js'
import { Section, Text, Button } from '../components.js'

import Page1 from './pages/Page1.jsx'
import Page2 from './pages/Page2.jsx'

const navigation = new Navigation({
  base: '/',
  mode: 'history',
  routes: [
    {
      name: 'home',
      path: '/',
    },
    {
      name: 'page1',
      path: '/page1',
    },
    {
      name: 'page2',
      path: '/page2/:id/:action?',
    },
  ],
})

const store = new Store({
  name: 'tomy',
  age: 10,
  weather: {},
})

const depo = new Depository()
depo.register({
  id: 'weather',
  url: 'http://www.weather.com.cn/data/sk/101010100.html',
})

depo.autorun(function() {
  const data = depo.get('weather')
  store.state.weather = data || {}
})

function Home() {
  return (
    <Section>
      <Text>Welcome to Nautil's world!</Text>

      <Navigate to="page1">
        <Button>Page1</Button>
      </Navigate>

      <Navigate to="page2" params={{ id: '123' }}>
        <Button>Page2</Button>
      </Navigate>
    </Section>
  )
}

class NotFound extends Component {
  static injectProps = {
    $navigation: true,
  }
  render() {
    return (
      <Section>
        <Text>Not found! {this.$navigation.status}</Text>
      </Section>
    )
  }
}

class App extends Component {
  render() {
    return (
      <Navigator navigation={navigation}>
        <Observer subscribe={dispatch => store.watch('*', dispatch)}>
          <Provider $state={store.state}>
            <Switch of={navigation.status}>
              <Case value="home">
                <Home />
              </Case>
              <Case value="page1">
                <Page1 />
              </Case>
              <Case value="page2">
                <Page2 />
              </Case>
              <Case default>
                <NotFound />
              </Case>
            </Switch>
          </Provider>
        </Observer>
      </Navigator>
    )
  }
}

export default App
