import { Component } from 'nautil'
import { Section, Text, Button } from 'nautil/components'

export class Page1 extends Component {
  static validateProps = {
    $state: {
      name: String,
      age: Number,
    },
  }

  static injectProps = {
    $state: true,
  }

  change() {
    // change the sepcial prop directly, which will trigger rerender
    this.$state.age = parseInt(Math.random() * 100, 10)
  }
  render() {
    const state = this.$state
    return (
      <Section>
        <Section><Text>name: {state.name}</Text></Section>
        <Section><Text>age: {state.age}</Text></Section>
        <Section><Button onHintEnd={() => this.change()}>change</Button></Section>
      </Section>
    )
  }
}

export default Page1
