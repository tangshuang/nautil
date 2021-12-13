# Controller

What is Controller in Nautil? It is in fact a type of special model, which controls view's data and reactive (events). In Nautil, a controller hold the view's data, so that you can use one controller to act different views in different scenes.

In many business situations, we have a same controller, but should act different views. The Controller is the way to keep the business logic same in one system, and be used in different views. For example, you have a payment module in your system, and have PC and App clients, however, business logic should must be same on both client sides. Here, you should create a controller which contains the same business logic, and use it on both client side views.

## Usage

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
  Order = this.reactive(
    (props) => {
      const { order_count, price } = this.someModel
      return (
        <Section>
          <Text>Total Price: {order_count * price}</Text>
        </Section>
      )
    },
    // this.reactive use evolve operator to controll rerenderer
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

  // create a component outside controller with `reactive`,
  // this component will reacted by controller's changes
  SomeAny = this.controller.reactive((props) => {
    return (
      <div>
        {this.controller.model.someText}
      </div>
    )
  })

  render() {
    const { Price, Order } = this.controller
    const { SomeAny } = this

    return (
      <Section>
        ...
        <Price />
        <Order />
        <SomeAny />
      </Section>
    )
  }
}
```

`Controller` is a helpfull tool in nautil, it is designed to control a business area in one place.
In a controller, you can define Model, Service, Events, Components and scoped handlers.
The exported components from a controller can be used in other components in Nautil, the exported components are treated as business components but with small code size.

## API

### reactive(component: Component | Function, collect?) -> NewComponent

Turn a component to be a new component which will reacted by controller inside actions.

```js
const MyComponent = controller.reactive(
  (props) => {}, // a component class or function
  (props) => {}, // function passed into evolve
)
```

### observe(observer: Model | Store | Function) -> { start, stop }

Observe other observable objects which are not put inside controller, for example:

```js
controller.observe((dispatch) => {
  const timer = setInterval(dispatch, 5000)
  return () => clearInterval(timer)
})
```

After this, controller will react each 5s.
