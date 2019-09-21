/**
 * - Navigate
 * - store.state.age++
 * - navigation.state.params
 */

import { Component } from 'nautil'
import { Section, Button, Text, Observer, Navigate } from 'nautil/components'
import { T } from 'nautil/i18n'

import store from '../store.js'
import navigation from '../navigation.js'

const grow = () => {
  store.state.age ++
}

class Page2 extends Component {
  render() {
    const { id, action } = navigation.state.params
    const { age } = store.state
    return (
      <Observer subscribe={dispatch => store.watch('age', dispatch)} unsubscribe={dispatch => store.unwatch('age', dispatch)} dispatch={this.update}>
        <Section>
          <Section>
            <Navigate to="home">
              <Button><T>home</T></Button>
            </Navigate>
            <Navigate to={-1}>
              <Button>Back</Button>
            </Navigate>
          </Section>
          <Section>
            <Section><Text>id: {id}</Text></Section>
            <Section><Text>action: {action}</Text></Section>
          </Section>
          <Section>
            <Text>age: {age}</Text>
            <Button onHint={() => grow()}>grow</Button>
          </Section>
        </Section>
      </Observer>
    )
  }
}

export default Page2
