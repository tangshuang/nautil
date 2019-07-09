import { Component } from 'nautil'
import { Navigate, Section, Button, Text } from 'nautil/components'

class Page2 extends Component {
  static injectProviders = {
    $navigation: true,
    $state: true,
  }

  grow = () => {
    this.$state.age ++
  }

  render() {
    const { params } = this.$navigation.state
    const { id, action } = params
    const { age } = this.$state
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
