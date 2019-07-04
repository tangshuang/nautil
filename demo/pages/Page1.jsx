import { Component, Navigate, Consumer } from '../../index.js'
import { Section, Button, Text } from '../../components.js'

class Page1 extends Component {
  static injectProviders = {
    $navigation: true,
  }

  render() {
    return (
      <Consumer name="$state">
        {$state => {
          const { name, age, info } = $state
          const grow = () => {
            $state.age ++
          }

          return (
            <Consumer name="$depo">
              {$depo => {
                return (
                  <Section>
                    <Section>
                      <Navigate to="home">
                        <Button>Home</Button>
                      </Navigate>
                      <Button onHintEnd={() => this.$navigation.go('page2', { id: '123', action: 'edit' })}>Page2</Button>
                    </Section>
                    <Section>
                      <Section><Text>name: {name}</Text></Section>
                      <Section><Text>age: {age}</Text></Section>
                      <Section><Text>time: {info.time}</Text></Section>
                    </Section>
                    <Section>
                      <Button onHintEnd={() => grow()}>grow</Button>
                      <Button onHintEnd={() => $depo.request('info')}>request</Button>
                      <Button onHintEnd={() => $depo.get('info')}>get</Button>
                    </Section>
                  </Section>
                )
              }}
            </Consumer>
          )
        }}
      </Consumer>

    )
  }
}

export default Page1
