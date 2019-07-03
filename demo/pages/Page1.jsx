import { Component, Navigate } from '../../index.js'
import { Section, Button, Text } from '../../components.js'

class Page1 extends Component {
  static injectProps = {
    $state: true,
    $navigation: true,
  }

  grow() {
    this.$state.age ++
  }

  render() {
    const { name, age, weather } = this.$state
    return (
      <Section>
        <Section>
          <Navigate to="home">
            <Button>Home</Button>
          </Navigate>
          <Button onHintEnd={() => this.$navigation.go('page2', { id: '123', action: 'edit' })}>Page2</Button>
        </Section>
        <Section>
          <Text>name: {name}</Text>
          <Text>age: {age}</Text>
          <Text>weather: {weather}</Text>
        </Section>
        <Section>
          <Button onHintEnd={() => this.grow()}>grow</Button>
        </Section>
      </Section>
    )
  }
}

export default Page1
