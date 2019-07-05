/**
 * a demo for using Consumer to receive 'state' provided by Provider
 * use this when mix Consumer and other components in your render
 */

import { Component, Consumer } from 'nautil'
import { Section, Text, Button } from 'nautil/components'

export class Page1 extends Component {
  render() {
    return (
      <Section>
        <Consumer name="$state">
          {(state) => {
            const change = () => {
              state.age ++
            }
            return (
              <Section>
                <Section><Text>name: {state.name}</Text></Section>
                <Section><Text>age: {state.age}</Text></Section>
                <Section><Button onHint={() => change()}>change</Button></Section>
              </Section>
            )
          }}
        </Consumer>
        <Text>This is not in Consumer.</Text>
      </Section>
    )
  }
}

export default Page1
