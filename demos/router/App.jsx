/**
 * This file only works in web
 */

import { React, Component, Observer, Switch, Case } from 'nautil'
import { Router } from 'nautil-dom'
import Page1 from './pages/Page1.jsx'
import Page2 from './pages/Page2.jsx'

const router = new Router({
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
      <Observer subscribe={dispatch => router.watch('*', dispatch)}>
        <Switch of={router.asknown}>
          <Case value="page1">
            <Page1></Page1>
          </Case>
          <Case value="page2">
            <Page2 type={router.state.params.type} id={router.state.params.id}></Page2>
          </Case>
          <Case default>
            <NotFound></NotFound>
          </Case>
        </Switch>
      </Observer>
    )
  }
}
export default App
