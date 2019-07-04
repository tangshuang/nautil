/**
 * a demo for using injectProviders to inject '$state' provided by Provider
 */

import { Component } from 'nautil'
import { Section, Text, Button } from 'nautil/components'

export class Page2 extends Component {
  static injectProviders = {
    $state: true,
  }

  change() {
    this.$state.age ++
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

export default Page2
