# decorate

```js
function H(props) {
  const {
    render,
  } = props
  const state = 1
  const data = 2
  return render(state, data)
}

function C(props) {
  const { state, data } = props
  return null
}

export default decorate(H, ['state', 'data'], 'render')(C) // ->
/**
 * function Wrapped(props) {
 *   return <H render={(state, data) =>
 *    <C {...props} state={state} data={data} />
 *   } />
 * }
 */
```

sign:

```
function decorate(HOC: ComponentType, params: string[], renderProp: string): ComponentType
```

- HOC: the higher order component to wrapper inner component
- params: names which read from render function's params and patch to inner component's props, the values is provided by HOC
- renderProp: the prop name of HOC render function, if renderProp is not passed, `children` should be a function to receive


For example, `Consumer`'s render function is`(value) => ...`, you should pass `['value']` to params, and the inner component will receive `const { value } = props`.
