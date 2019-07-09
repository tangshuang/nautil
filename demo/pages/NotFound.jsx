import { Component } from 'nautil'
import { Section, Text } from 'nautil/components'

export class NotFound extends Component {
  static injectProviders = {
    $navigation: true,
  }
  render() {
    return (
      <Section>
        <Text>Not found! {this.$navigation.status}</Text>
      </Section>
    )
  }
}
export default NotFound
