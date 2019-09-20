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
          <Navigate to="page7.child.subchild">
            <Button><T>child</T></Button>
          </Navigate>
          <Navigate to="page7.child1">
            <Button><T>child1</T></Button>
          </Navigate>
          <Navigate to="page7.child2">
            <Button><T>child2</T></Button>
          </Navigate>
        </Section>

        <Route match="page7.child1">
          <Text>child1</Text>
        </Route>

        <Route match="page7.child2">
          <Text>child2</Text>
        </Route>

        <Route match="page7.child.subchild"></Route>
      </Section>
    )
  }
}

export class Child extends Component {
  render() {
    return (
      <Section>
        <Text>child</Text>
      </Section>
    )
  }
}

export default Page7
