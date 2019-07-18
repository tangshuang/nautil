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
          enter="easeInQuint 500 fade:in move:right scale:1.5 rotate:60deg"
          leave="easeOutQuint 500 fade:out move:0/-300,-100 scale:1/0.5 rotate:0deg/-20deg"
        >
          <Text>This is a demo for animation.</Text>
        </Animation>
      </Section>
    )
  }
}

export default Page3
