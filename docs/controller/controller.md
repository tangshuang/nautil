# Controller

```js
import { Controller, Model, Service } from 'nautil'

class SomeModel extends Model {}

class SomeService extends Service {}

class SomeController extends Controller {
  static someModel = SomeModel
  static someService = SomeService

  static increase$(stream) {
    stream.subscribe(() => {
      this.someModel.some = 'xxx'
    })
  }

  handleRemove() {
    ...
  }

  // a component
  PriceSection(props) {
    const value = useState(0) // can use hooks

    return (
      <Section>
        <Text>{this.someModel.price}</Text>
        <Input $value={value} />
        <Button onHit={this.increase$}>+</Button>
      </Section>
    )
  }
}
```

```js
class Some extends Component {
  controller = new SomeController()

  render() {
    const { PriceSection } = this.controller

    return (
      <Section>
        ...
        <PriceSection />
      </Section>
    )
  }
}
```

`Controller` is a helpfull tool in nautil, it is designed to control a business area in one place.
In a controller, you can define Model, Service, Events, Components and scoped handlers.
The exported components from a controller can be used in other components in Nautil, the exported components are treated as business components but with small code size.
