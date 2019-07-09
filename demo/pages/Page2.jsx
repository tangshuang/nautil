/**
 * 1. injectProviders
 * 2. Navigate
 * 3. store.state.age++
 * 4. receive navigation.state.params
 */

import { Component } from 'nautil'
import { Navigate, Section, Button, Text } from 'nautil/components'

class Page2 extends Component {
  static injectProviders = {
    $navigation: true,
    $store: true,
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
          <Text>id: {id}</Text>
          <Text>action: {action}</Text>
        </Section>
        <Section>
          <Text>age: {age}</Text>
          <Button onHint={this.grow}>grow</Button>
        </Section>
      </Section>
    )
  }
}

export default Page2
