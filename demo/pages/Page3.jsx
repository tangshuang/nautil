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
        <Animation
          show={this.state.show}
          enter="easeInElastic 500 fade:in move:right,top scale:1.5/1"
          leave="easeInQuad 500 fade:out move:0/-300 scale:1/1.5"
        >
          <Text>This is a demo for animation.</Text>
        </Animation>
      </Section>
    )
  }
}

export default Page3
