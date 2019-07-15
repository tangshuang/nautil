/**
 * 1. connect
 * 2. Navigate
 * 3. store.state.age++
 * 4. receive navigation.state.params
 */

import { Component, connect } from 'nautil'
import { Navigate, Section, Button, Text } from 'nautil/components'
import { storeContext } from '../contexts.js'

class Page2 extends Component {
  static injectProps = {
    $store: true,
    $navigation: true,
  }

  grow = () => {
    this.$store.state.age ++
  }

  render() {
    const { params } = this.$navigation.state
    const { id, action } = params
    const { age } = this.$store.state
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
  $store: storeContext,
  $navigation: Navigate.Context,
})(Page2)

export default ConnectedPage2
