/**
 * 1. connect
 * 2. Navigate
 * 3. store.state.age++
 * 4. navigation.state.params
 */

import { Component, Navigate, connect } from 'nautil'
import { Section, Button, Text } from 'nautil/components'

import { storeContext } from '../store.js'

class Page2 extends Component {
  grow = () => {
    const { state } = this.attrs.store
    state.age ++
  }

  render() {
    const { id, action } = this.attrs.navigation.state.params
    const { age } = this.attrs.store.state
    return (
      <Section>
        <Section>
          <Navigate to="home">
            <Button>Home</Button>
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
          <Button onHint={this.grow}>grow</Button>
        </Section>
      </Section>
    )
  }
}

const ConnectedPage2 = connect({
  store: storeContext,
  navigation: Navigate.Context,
})(Page2)

export default ConnectedPage2
