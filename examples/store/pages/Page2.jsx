/**
 * a demo for using injectProviders to inject '$state' provided by Provider
 */

import { Component } from 'nautil'
import { Section, Text, Button } from 'nautil/components'

export class Page2 extends Component {
  static injectProviders = {
    $store: true,
  }

  change() {
    this.$store.state.age ++
  }

  render() {
    const { state } = this.$store
    return (
      <Section>
        <Section><Text>name: {state.name}</Text></Section>
        <Section><Text>age: {state.age}</Text></Section>
        <Section><Button onHint={() => this.change()}>change</Button></Section>
      </Section>
    )
  }
}

export default Page2
