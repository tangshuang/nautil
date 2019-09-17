import { Component } from 'nautil'
import { Text, Section, Button, Navigate, Show, If, Switch, Case, For, Each } from 'nautil/components'
import { T } from 'nautil/i18n'

export class Page5 extends Component {
  state = {
    show: false,
  }
  render() {
    return (
      <Section>
        <Section>
          <Navigate to="home">
            <Button><T>home</T></Button>
          </Navigate>
          <Button onHint={() => this.setState({ show: true })}>show</Button>
          <Button onHint={() => this.setState({ show: false })}>hide</Button>
        </Section>

        <Show is={this.state.show}>
          <Text>show in `Show`</Text>
        </Show>

        <If is={this.state.show}>
          <Section><Text>show in `If`</Text></Section>
        </If>

        <Switch of={this.state.show}>
          <Case value={true}>
            <Section><Text>true in `Swtich`</Text></Section>
          </Case>
          <Case value={false}>
            <Section><Text>false in `Switch`</Text></Section>
          </Case>
        </Switch>

        <Section>
          <For start={1} end={5}>
            {i => <Text key={i}>{i}</Text>}
          </For>
        </Section>

        <Section>
          <Each of={{ name: 'tomy', age: 10 }}>
            {(value, key) => <Section key={key}>
              <Text>{key}: {value}</Text>
            </Section>}
          </Each>
        </Section>
      </Section>
    )
  }
}

export default Page5
