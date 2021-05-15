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
  // this component will be automaticly rerendered when the controller's models, stores, dataServices changed
  Price(props) {
    const value = useState(0) // can use hooks

    return (
      <Section>
        <Text>{this.someModel.price}</Text>
        <Input $value={value} />
        <Button onHit={this.increase$}>+</Button>
      </Section>
    )
  }

  // a component
  // this component will be rendered only when this.someModel's order_count and price properties changed
  // this.turn use evolve operator to controll rerenderer
  Order = this.turn(
    (props) => {
      const { order_count, price } = this.someModel
      return (
        <Section>
          <Text>Total Price: {order_count * price}</Text>
        </Section>
      )
    },
    (props) => {
      const { order_count, price } = this.someModel
      return { order_count, price }
    },
  )
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
