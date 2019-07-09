/**
 * connect
 */

import { Component, connect } from 'nautil'
import { Navigate, Text, Section, Button } from 'nautil/components'

export class Page4 extends Component {
  render() {
    const { name, age, info } = this.attrs.$store.state
    const grow = () => {
      this.attrs.$store.state.age ++
    }
    return (
      <Section>
        <Section>
          <Navigate to="home">
            <Button>Home</Button>
          </Navigate>
        </Section>
        <Section>
          <Section><Text>name: {name}</Text></Section>
          <Section><Text>age: {age}</Text></Section>
          <Section><Text>time: {info.time}</Text></Section>
        </Section>
        <Section>
          <Button onHint={grow}>grow</Button>
        </Section>
      </Section>
    )
  }
}

const mapToProps = {
  $store: true,
  $navigation: true,
  $depo: true,
}
export default connect(mapToProps)(Page4)
