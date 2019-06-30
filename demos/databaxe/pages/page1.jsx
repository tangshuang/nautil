import { React, Component, Observer, Text } from 'nautil'

export class Page1 extends Component {
  static injectProps = {
    $databaxe: true,
  }
  
  render() {
    const url = this.$databaxe.get('registryUrl')
    return <Observer subscribe={dispatch => this.$databaxe.subscribe('registryUrl', dispatch)}>
      <Text>{url}</Text>
    </Observer>
  }
}