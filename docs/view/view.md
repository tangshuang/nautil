# View

A `View` is a set of components which are as APIs in code level. Why? When we use Controller, we will use it in Components to controll the UX parts. However, this is heavy, we have to `this.controller.reactive()` many times in a component, and in fact, we find that the reactive components are not strong relative to current component. So we need a `View` to manage this special reactive components which based on controller.

## Usage

```js
import { Controller, View, Component } from 'nautil'

// create a controller
class SomeController extends Controller {
  ...
}

// create a view with previous controller
class SomeView extends View {
  static controller = SomeController

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

// use the view
class SomeComponent extends Component {
  view = new SomeView()

  render() {
    const { Count, Order } = this.view

    return (
      <>
        <Count />
        <Order />
      </>
    )
  }
}
```

A `View` can not only be used in a Component, it can be used anywhere, it is a set of components to provide UI elements of business, so you do not need to worry about the business actions in real React UI components development.
