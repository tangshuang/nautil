import { Component, Navigate } from 'nautil'
import { Text, Section, Button } from 'nautil/components'
import { Animation } from 'nautil/animation'

export class Page3 extends Component {
  state = {
    show: false,
  }
  render() {
    return (
      <Section>
        <Section>
          <Navigate to="home">
            <Button>Home</Button>
          </Navigate>
          <Button onHint={() => this.setState({ show: true })}>show</Button>
          <Button onHint={() => this.setState({ show: false })}>hide</Button>
        </Section>
        <Animation enter="fade:in move:300,0/0,20 scale:1.2" leave="fade:out move:0,20/-300,0 scale:0.5" show={this.state.show} duration={500}>
          <Text>This is a demo for animation.</Text>
        </Animation>
      </Section>
    )
  }
}

export default Page3
