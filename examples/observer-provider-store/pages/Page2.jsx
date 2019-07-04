/**
 * a demo for using consumeProviders to receive 'state' provided by Provider
 * if your whole render is based on some provided values, you can use this method
 */

import { Component } from 'nautil'
import { Section, Text, Button } from 'nautil/components'

export class Page2 extends Component {
  static consumeProviders = {
    state: true,
  }

  consumeRender({ state }) {
    const change = () => {
      state.age ++
    }
    return (
      <Section>
        <Section><Text>name: {state.name}</Text></Section>
        <Section><Text>age: {state.age}</Text></Section>
        <Section><Button onHintEnd={() => change()}>change</Button></Section>
      </Section>
    )
  }
}

export default Page2
