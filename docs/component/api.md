# Component API

When you create a component by using `Component`, you can use:

## hook

Preload hook functions to generate a function.

```js
import { Component } from 'nautil'

class SomeComponent extends Component {
  handleSubmit = this.hook(
    () => {
      const [submiting, setSubmiting] = useState(false)
      return [submiting, setSubmiting]
    },
    ([submiting, setSubmiting]) => (e) => {
      if (submiting) {
        e.preventDefault()
        return
      }

      setSubmiting(true)
      setTimeout(() => setSubmiting(false), 500)

      // do submit ...
    },
  )

  render() {
    return <form onSubmit={this.handleSubmit}>...</form>
  }
}
```

In previous code, we use `this.hook` to create a function which is passed to `onSubmit`, when user click submit button, the code check `submiting` state, if it is true, prevent submiting until turned to be false.

`this.hook` receive functions:

```
this.hook(fn1, fn2, fn3, action)
```

In `fn1` `fn2` `fn3` ... you can use hook functions to declare some state, they will be called when the component is being rendered and given back the results to `action` function.
`action` receive what the previous functions return, so you can use hook functions results in `action`.

`action` can return a function, so that you can use it as a handler to receive parameters, as previous code done. Or you can return a normal value, for example:

```js
getSome = this.hook(
  () => {
    return useSomeHook()
  },
  (some) => {
    return some + 1
  },
)
```

In this code you return `some + 1` so when you invoke `this.getSome()` in your component, you will get `some + 1`.

If you pass only one function into `this.hook`, it means you ellipsis the final `action` function, `action` will be set to `value => value`. For example:

```js
getSome = this.hook(() => useSomeHook())
```

When you run `this.getSome()`, you will get the first function's output.

## Component#hook

Nautil provides two special Component static method as property decorators, they are `Component#hook` and `Component#memo`.

```js
class MyComponent extends Component {
  static props = {
    id: String,
  }

  /**
   * make this.data works with hooks
   */
  @Component.hook()
  get data() {
    const data = useDataSource(mySource, this.props.id)
    return data
  }

  /**
   * make this.handleGoDetail works with hooks
   */
  @Component.hook()
  get handleGoDetail() {
    const navigate = useRouteNavigate()
    return (id) => {
      navigate(id)
    }
  }

  /**
   * run the function with hooks directly when render, without any affects to current component
   */
  @Component.hook()
  autoWatchChange() {
    useEffect(() => {
      // ...
    }, [])
  }

  /**
   * make this.handleClickNext can be used as handler directly
   * <a click={this.handleClickNext}>
   */
  @Component.memo()
  handleClickNext() {
    this.setState({ step: this.state.step + 1 })
  }

  /**
   * only read once
   */
  @Component.memo()
  get total() {
    return localStorage.getItem('total')
  }

  render() {
    const { data } = this

  }
}
```

## weakUpdate/forceUpdate/update

There are 3 sepcial methods on component, so that you can easily trigger the update of the component.

```js
class SomeComponent extends Component {
  render() {
    return (
      <>
        <button onClick={this.weakUpdate}>weakUpdate</button>
        <button onClick={this.forceUpdate}>forceUpdate</button>
      </>
    )
  }
}
```

All these 3 methods return a Promise, so that you can wait updating to do something.

`weakUpdate` will be break if you make `shouldUpdate` return false. `forceUpdate` will force update even you make `shouldUpdate` return false.

`update` is more special, it can receive paramters:

```
this.update(true) // this.forceUpdate()
this.update() // this.weakUpdate()
this.update({ ... }) // this.setState({ ... })
this.update(state => state.a = 1) // this.setState({ a: 1 }), we use immerjs inside to ensure immutable update
this.update('a', 1) // this.setState({ a: 1 })
this.update('a.b.c', 1) // this.update(state => state.a.b.c = 1), support keyPath
```

## nextTick

Run a function after current rendering.

```js
this.nextTick((a, b) => {
  // do something with a and b
}, a, b)
```

If you want to execute something which do not want to break preformance, you will need this.

## static extend

If you want to extend a componet, you may need this.

```js
import { Button } from 'nautil'

const SubmitButton = Button.extend({
  stylesheet: ['button-primary', { color: 'white' }],
  props: {
    type: 'submit',
  },
  deprecated: [
    'title',
  ],
})
```

You have defined a component `Button` and now you want to create a new component `SubmitButton` which is based on `Button` but change some stylesheet and props and disable `title` prop. Now you get a new component which is extend from `Button`.

```js
// here `title` prop is deprecated (not working inside)
<SubmitButton title="remove" onClick={handleClick}>submit</SubmitButton>
```

With `extend`, you can get more components with little changes quickly.
