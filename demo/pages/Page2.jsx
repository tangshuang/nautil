import { Component } from 'nautil'
import { Navigate, Section, Button, Text } from 'nautil/components'

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
          <Navigate to={-1}>
            <Button>Back</Button>
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
