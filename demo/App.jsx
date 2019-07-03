import { Component, Navigation, Navigator, Observer, Provider, Store, Depository } from '../index.js'

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
      path: '/page2/'
    },
  ],
})

class App extends Component {

}

export default App