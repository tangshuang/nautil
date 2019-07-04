import { Component, Navigate, Consumer } from '../../index.js'
import { Section, Button, Text } from '../../components.js'

class Page1 extends Component {
  render() {
    return (
      <Consumer name="$state">
        {$state => {
          const { name, age, weather } = $state
          const grow = () => {
            $state.age ++
          }
          return <Section>
            <Section>
              <Navigate to="home">
                <Button>Home</Button>
              </Navigate>
              <Button onHintEnd={() => this.$navigation.go('page2', { id: '123', action: 'edit' })}>Page2</Button>
            </Section>
            <Section>
              <Text>name: {name}</Text>
              <Text>age: {age}</Text>
              <Text>weather: {JSON.stringify(weather)}</Text>
            </Section>
            <Section>
              <Button onHintEnd={() => grow()}>grow</Button>
            </Section>
          </Section>
        }}
      </Consumer>

    )
  }
}

export default Page1
