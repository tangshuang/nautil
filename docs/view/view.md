# View

A View is a super Component which is reactive for Controller, Model, and streams. Why we need a super Component? Because we need to combine all parts together. In a View, you can do what you do in a Component, and you can also combine with Controller so that the View will rerender when Controller trigger something.

- alias: `Container` in order to avoid conflict with `View` from react-native.

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
    // this.reactive use evolve decorator to controll rerenderer
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

## Persist

In some cases, you may want to share Controller amoung some View, you can referer the same Controller and open Persistent mode:

```js
class SomeController extends Controller {}

// extends View.Persist()
class AaView extends View.Persist() {
  static controller = SomeController
}

// invoke Persist() on component
class BbViewBase extends View {
  static controller = SomeController
}
const BbView = BbViewBase.Persist()

function Wrapper() {
  // useController to read controller from a Persistent component
  const controller = useController(SomeController, AaView)

  return (
    <>
      <AaView />
      <BbView />
    </>
  )
}
```

In the previous code, `controller` inside `AaView`, `BbView`, `Wrapper` is the same one which is initialized from `SomeController.instance()`. Even other Persist View which use `SomeController` will share the same one. With single instance, you can make it more easy to share controllers amoung views.
