import { Component, Navigate } from '../../index.js'
import { Section, Button, Text } from '../../components.js'

class Page2 extends Component {
  static injectProviders = {
    $navigation: true,
  }

  render() {
    const { params } = this.$navigation.state
    const { id, action } = params
    return (
      <Section>
        <Section>
          <Navigate to="home">
            <Button>Home</Button>
          </Navigate>
        </Section>
        <Section>
          <Text>id: {id}</Text>
          <Text>action: {action}</Text>
        </Section>
      </Section>
    )
  }
}

export default Page2
