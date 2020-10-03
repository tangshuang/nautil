# Class or Function?

> Should we use class components? Can we use functional components?

Although we are try to support react completely, we had some difficulty to face. Remember the following rules:

**1. (IMPORTANT) Polluted components can only be used in class components!**

If you want to use polluted components like `Link` `Consumer`, you should use them in class components.

```js
function App() {
  return (
    <Provider store={store}>
      <MyComponent />
    </Provider>
  )
}

// bad
function MyComponent() {
  return ( // not works here
    <Consumer>{({ state }) => {
      return <span>{state.name}</span>
    }}</Consumer>
  )
}

// better
function MyComponent() {
  return ( // works here
    <Consumer store={store}>{({ state }) => {
      return <span>{state.name}</span>
    }}</Consumer>
  )
}

// good
class MyComponent extends Component {
  render() {
    return ( // works here
      <Consumer>{({ state }) => {
        return <span>{state.name}</span>
      }}</Consumer>
    )
  }
}
```

List:

- Navigator
  - Route
  - Link
  - Navigate
- Provider
  - Consumer
- Language
  - Text
  - Locale

**2. Two way binding only works for class components.**

You should must create a class component to receive two way binding props, function components have no ability of nautil.

```js
// bad
function MyComponent(props) {
  return <button onClick={() => props.age ++}>grow</button>
}

// good
class MyComponent extends Component {
  static props = {
    $age: Number,
  }

  render() {
    const { age } = this.attrs
    return <button onClick={() => this.attrs.age ++}>grow</button>
  }
}
```

**3. `stylesheet`, `props`, `defaultStylesheet` and event-stream only works for class component.**

```js
// bad
function A() {
  return <div stylesheet={[...]}>xxx</div>
}
A.props = {}
A.defaultStylesheet = []

// ok
function A() {
  return <Section stylesheet={[...]}>xxx</Section>
}
// bad
A.props = {}
A.defaultStylesheet = []

// good
class A extends Component {
  static props = {}
  static defaultStylesheet = []

  render() {
    return <Section stylesheet={[...]}>xxx</Section>
  }
}
```
