import { Component } from 'nautil'
import { Section, Button, Navigate, Route, Text } from 'nautil/components'
import { T } from 'nautil/i18n'
import { Animation } from 'nautil/animation'

export class Page7 extends Component {
  render() {
    return (
      <Section>
        <Section>
          <Navigate to="home">
            <Button><T>home</T></Button>
          </Navigate>
          <Navigate to="page7.child">
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
          {() => <Text>child1</Text>}
        </Route>

        <Route match="page7.child2"
          animation={600}
          component={Animation}
          props={{
            enter: "600 fade:in",
            leave: "easeInQuad 600 fade:out move:0/-300,-100 scale:1/1.5",
          }}
        >
          <Text>child2</Text>
        </Route>

        <Route match="page7.child">
          <Text>child</Text>
          <Navigate to="page7.child.subchild" component={Button}>subchild</Navigate>
          <Navigate to="page7.child.subchild2" component={Button}>subchild2</Navigate>
          <Section>------------------</Section>
          <Route match="page7.child.subchild" component={Child}></Route>
          <Route match="page7.child.subchild2"></Route>
        </Route>
      </Section>
    )
  }
}

export class Child extends Component {
  render() {
    return (
      <Section>
        <Text>sub child</Text>
      </Section>
    )
  }
}

export default Page7
