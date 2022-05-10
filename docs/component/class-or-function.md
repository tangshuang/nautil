# Class or Function?

> Should we use class components? Can we use functional components?

Although we are try to support react completely, we had some difficulty to face. Remember the following rules:

**1. Class components is much more strong than functional components!**

**2. Two way binding only works for class components.**

You should must create a class component to receive two way binding props, function components have no ability of nautil.

```js
// bad
function MyComponent(props) {
  return <button onClick={() => props.age ++ /* not support */}>grow</button>
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

## Use hooks in Class component.

To use hooks functions in class component, you should must set `Render` method then `render`.

```js
class Some extends Component {
  Render(props) {
    // use hooks directly here
    const [value, setState] = useState('')
    return <Input $value={[value, setState]}>
  }
}
```
