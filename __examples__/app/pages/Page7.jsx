import { Component } from 'nautil'
import { Section, Button, Navigate, Route, Text } from 'nautil/components'
import { T } from 'nautil/i18n'

export class Page7 extends Component {
  render() {
    return (
      <Section>
        <Section>
          <Navigate to="home">
            <Button><T>home</T></Button>
          </Navigate>
          <Navigate base="page7" to="child1">
            <Button><T>child1</T></Button>
          </Navigate>
        </Section>

        <Route match="child1" base="page7">
          <Child1 />
        </Route>
      </Section>
    )
  }
}

export class Child1 extends Component {
  render() {
    return (
      <Section>
        <Text>child1</Text>
      </Section>
    )
  }
}

export default Page7
