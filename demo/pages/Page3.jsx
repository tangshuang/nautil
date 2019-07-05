import { Component, Navigate } from '../../index.js'
import { Text, Section, Button } from '../../components.js'
import { Animation } from '../../animation.js'

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
        <Animation enter="fade:in moveto:left-top" leave="fade:out moveto:right-bottom" show={this.state.show} duration={500}>
          <Text>This is a demo for animation.</Text>
        </Animation>
      </Section>
    )
  }
}
export default Page3
