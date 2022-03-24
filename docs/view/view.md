# View

A View is a super Component which is reactive for Controller, Model, and streams. Why we need a super Component? Because we need to combine all parts together. In a View, you can do what you do in a Component, and you can also combine with Controller so that the View will rerender when Controller trigger something.

## Usage

```js
import { Controller, View } from 'nautil'

// create a controller
class SomeController extends Controller {
  ...
}

// create a view with previous controller
class SomeView extends View {
  static controller = SomeController // Controller -> this.controller
  static someModel = SomeModel // Model -> this.someModel
  static someDataService = SomeDataService // DataService -> this.someDataService
  static someService = SomeService // Service -> this.someService (single instance)
  static store = Store // Store -> this.store, used as state helper

  // a component
  // this component will be automaticly rerendered when the controller's models, stores, dataServices changed
  static Count(props) {
    const value = useState(0) // can use hooks

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
  Order = this.reactive(
    (props) => {
      const { order_count, price } = this.controller.someModel
      return (
        <Section>
          <Text>Total Price: {order_count * price}</Text>
        </Section>
      )
    },
    // this.reactive use evolve operator to controll rerenderer
    (props) => {
      const { order_count, price } = this.controller.someModel
      return { order_count, price }
    },
  )

  render() {
    const { Count, Order } = this

    return (
      <>
        <Count />
        <Order />
      </>
    )
  }
}
```

## API

### reactive(component: Component | Function, collect?) -> NewComponent

Turn a component to be a new component which will reacted by controller inside actions.

```js
const MyComponent = controller.reactive(
  (props) => {}, // a component class or function
  (props) => {}, // function passed into evolve
)
```

### observe(observer)

```
observer: {
  subscribe(dispatch): void;
  unsubscribe(dispatch): void;
}
```

```js
class SomeView extends View {
  static events = SomeEventService

  init() {
    this.observe({
      subscribe: dispatch => this.events.on('SomeEvent', dispatch),
      unsubscribe: dispatch => this.events.off('SomeEvent', dispatch),
    })
  }
}
```
