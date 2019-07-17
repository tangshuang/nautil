import { Component, Navigate } from 'nautil'
import { Text, Section, Button } from 'nautil/components'
import { Animation } from 'nautil/animation'
import { inject } from 'nautil/operators'
import navigation from '../navigation.js'

export class Page3 extends Component {
  state = {
    show: false,
  }
  render() {
    const Link = inject('navigation', navigation)(Navigate)
    return (
      <Section>
        <Section>
          <Link to="home">
            <Button>Home</Button>
          </Link>
          <Button onHint={() => this.setState({ show: true })}>show</Button>
          <Button onHint={() => this.setState({ show: false })}>hide</Button>
        </Section>
        <Animation enter="fade:in moveto:left" leave="fade:out moveto:right" show={this.state.show} duration={500}>
          <Text>This is a demo for animation.</Text>
        </Animation>
      </Section>
    )
  }
}
export default Page3
