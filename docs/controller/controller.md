# Controller

What is Controller in Nautil? It is in fact a type of special model, which controls view's data and reactive (event handlers). In Nautil, a controller orient a business scenes.

In many business scenes, we have a same controller, but should act different views. The Controller is the way to keep the business logic same in one system, and be used in different views. For example, you have a payment module in your system, and have PC and App clients, however, business logic should must be same on both client sides. Here, you should create a controller which contains the same business logic, and use it on both client side views.

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
}
```

To use the previous Controller:


```js
import { Section, Button, useState } from 'nautil'

class Some extends Component {
  // initialize the controller
  controller = new SomeController()

  // a component, which use controller inside
  Count = (props) => {
    const value = useState(0) // can use hooks
    const [, update] = useState()

    useEffect(() => {
      const forceUpdate = () => update({})
      this.controller.subscribe(forceUpdate)
      return () => this.conntroller.unsubscribe(forceUpdate)
    }, [])

    return (
      <Section>
        <Text>{this.controller.someModel.count}</Text>
        <Input $value={value} />
        <Button onHit={this.controller.increase$}>+</Button>
      </Section>
    )
  }

  // a component
  // this component will be rendered only when this.someModel's order_count and price properties changed
  Order = (props) => {
    const [, update] = useState()

    useEffect(() => {
      const forceUpdate = () => update({})
      this.controller.subscribe(forceUpdate)
      return () => this.conntroller.unsubscribe(forceUpdate)
    }, [])

    const { order_count, price } = this.someModel
    return (
      <Section>
        <Text>Total Price: {order_count * price}</Text>
      </Section>
    )
  }

  render() {
    const { Count, Order } = this.controller
    const { IncreaseButton } = this

    return (
      <Section>
        ...
        <Price />
        <Order />
        <IncreaseButton />
      </Section>
    )
  }
}
```

`Controller` is a helpfull tool in nautil, it is designed to control a business area in one place.
In a controller, you can define Model, Service, Events, Components and scoped handlers.
The exported components from a controller can be used in other components in Nautil, the exported components are treated as business components but with small code size.

When define a Controller, you should `extends` from `Controller` class, and given static properties. For example:

```js
class SomeController extends Controller {
  static someModel = SomeModel // Model -> this.someModel
  static someDataService = SomeDataService // DataService -> this.someDataService
  static someService = SomeService // Service -> this.someService (single instance)
  static count$(stream$) { // stream$() -> this.count$
    // here you can use this point to Controller instance
    stream$.pipe(...).subscribe(...)
  }
  static store = Store // Store -> this.store, used as state helper

  // after Controller initialized
  init() {}

  // provide an API method
  decreaseCount() {
    this.count$.next(...)
  }
}
```

**You should never operate UI in controller.** A controller is an API set to provide to views, so you should keep in mind that it is an independent system from UI operation. And this is the way to seperate business logic from React components, make business logic management as an independent job.

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
