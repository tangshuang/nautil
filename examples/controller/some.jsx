import { React, Component, Controller, Model, Meta, Text, Button, Section } from 'nautil'

class Title extends Meta {
  default = ''
  type = String
  maxLength = 50
}

class Price extends Meta {
  default = 0
  type = Number
  min = 0
}

class SomeModel extends Model {
  static title = Title
  static price = Price
}

class SomeController extends Controller {
  static some = SomeModel

  static increase$(stream) {
    stream.subscribe(() => this.some.price ++)
  }

  Title() {
    return (
      <Text>{this.some.title}</Text>
    )
  }

  Price() {
    return (
      <Text>{this.some.price}</Text>
    )
  }

  IncreasePriceButton(props) {
    return (
      <Button onHit={this.increase$}>{props.children || 'Increase Price'}</Button>
    )
  }
}

export default class Some extends Component {
  controller = new SomeController()

  render() {
    const { Title, Price, IncreasePriceButton } = this.controller
    return (
      <Section>
        <Section><Text>Title:</Text><Title /></Section>
        <Section><Text>Price:</Text><Price /></Section>
        <Section><IncreasePriceButton /></Section>
      </Section>
    )
  }
}
