/**
 * - store.state.age++
 * - depo.request vs. depo.get
 * - navigation.go
 */

import { Component, Navigate, observe, pipe } from 'nautil'
import { Section, Button, Text } from 'nautil/components'

import store from '../store.js'
import depo from '../depo.js'
import navigation from '../navigation.js'

const grow = () => {
  store.state.age ++
}

class Page1 extends Component {
  render() {
    const { name, age } = store.state
    const info = depo.get('info') || {}
    return (
      <Section>
        <Section>
          <Navigate to="home">
            <Button>Home</Button>
          </Navigate>
          <Button onHint={() => navigation.go('page2', { id: '123', action: 'edit' })}>Page2</Button>
        </Section>
        <Section>
          <Section><Text>name: {name}</Text></Section>
          <Section><Text>age: {age}</Text></Section>
          <Section><Text>time: {info.time}</Text></Section>
        </Section>
        <Section>
          <Button onHint={() => grow()}>grow</Button>
          <Button onHint={() => depo.request('info')}>request</Button>
          <Button onHint={() => depo.get('info')}>get</Button>
        </Section>
      </Section>
    )
  }
}

const wrap = pipe([
  observe(dispatch => store.watch(['name', 'age'], dispatch), dispatch => store.unwatch(['name', 'age'], dispatch)),
  observe(dispatch => depo.subscribe('info', dispatch), dispatch => depo.unsubscribe('info', dispatch)),
])
export default wrap(Page1)
