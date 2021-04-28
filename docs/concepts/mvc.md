# MVC

Stands for "Model-View-Controller." MVC is an application design model comprised of three interconnected parts. They include the model (data), the view (user interface), and the controller (processes that handle input). The MVC model or "pattern" is commonly used for developing modern user interfaces.

In Nautil, you have `Model` `Controller` `Component` `Service` to build a system which follow the MVC pattern. In normally, you just need `Component` if you only want to create a UI renderer. When you want to organize code more reasonable with user's inputing, you will need `Controller`. When you want to manage data with more mandatory, you will need `Model`. And if you want to control data flow over all the application more exactly, you will need `Service`.

`Rxjs` is used to response users' inputing in `Controller`, for example:

```js
import { React, Controller, Component, Store, Section, Input, Text } from 'nautil'

class MyController extends Controller {
  // Controller will initialize this.store of Store, and subscribe the changes to trigger rerendering
  static store = Store

  // Controller will initialize this.price$ of Stream (Rxjs Subject)
  // the initialized stream is passed into the function to be subscribed
  static price$(stream) {
    stream.pipe(e => +e.target.value)
      .pipe((price) => {
        const { count } = this.store.getState()
        return { count, price }
      })
      // a Rxjs Subject can be used as an observer
      .subscribe(this.total$)
  }
  static count$(stream) {
    stream.pipe(e => +e.target.value)
      .pipe((count) => {
        const { price } = this.store.getState()
        return { count, price }
      })
      .subscribe(this.total$)
  }
  static total$(stream) {
    stream.subscribe(({ count, price }) => {
      const total = price * count
      this.store.setState({ price, count, total })
    })
  }

  // a method whose name begins with uppercase will be treated as a component
  InputPrice() {
    const { price } = this.store.getState()
    return (
      <Section>
        <Text>Price:</Text>
        <Input value={price} onChange={this.price$} />
      </Section>
    )
  }

  InputCount() {
    const { count } = this.store.getState()
    return (
      <Section>
        <Text>Count:</Text>
        <Input value={count} onChange={this.count$} />
      </Section>
    )
  }

  ShowTotal() {
    const { total } = this.store.getState()
    return (
      <Section>
        <Text>Total: {total}</Text>
      </Section>
    )
  }
}

class MyComponent extends Component {
  controller = new MyController()

  render() {
    // components defined by controller can be destructed
    const { InputPrice, InputCount, ShowTotal } = this.controller

    return (
      <Section>
        <InputPrice />
        <InputCount />
        <ShowTotal />
      </Section>
    )
  }
}
```

Notice the previous code, we defined state with a Store, input streams and components which used state and streams. Before we initialize the MyController, it did nothing, and then we initialized, we only used the components on it. The code management is autonomic: Controller controls the atom UI components and input streams, and an enter Component use the controller's components.

We will seprate our business into small units by using Controller (event controllers), and compose these fragments by a Component.
