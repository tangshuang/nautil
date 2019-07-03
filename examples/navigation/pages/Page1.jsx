import { Component, Navigation, Navigate } from 'nautil'
import { Section, Text, Button } from 'nautil/components'

export class Page1 extends Component {
  static validateProps = {
    $navigation: Navigation,
  }

  static injectProps = {
    $navigation: true,
  }

  render() {
    const { state } = this.$navigation
    const { params } = state
    const { name } = params

    return (
      <Section>
        <Section><Text>name: {name}</Text></Section>
        {/* use Navigate */}
        <Section><Navigate to="page2" params={{ type: 'cat', id: '22' }}><Text>go</Text></Navigate></Section>
        {/* use Navigation method */}
        <Section><Button onHintEnd={() => this.$navigation.go('page2', { type: 'dog', id: '123' })}>go</Button></Section>
      </Section>
    )
  }
}

export default Page1
