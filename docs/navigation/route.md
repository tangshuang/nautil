# Route

Route component is the end component to render based on navigation.

```js
<Route navigation={navigation} match={/book\/[0-9]+/}>
  <Book id={navigation.state.params.id} />
</Route>
```

## props

- navigation: which navigation to base on
- match: match pattern passed into navigation.is
- exact: exact passed into navigation.is

However, if you use `Route` in `Navigator`, you do not need to pass navigation prop.


## Component Render

```js
<Route navigation={navigation} match="some" component={Some} props={{ title: 'Some' }}>
  <Text>children</Text>
</Route>
```

## Function Render

```js
function Home(props) {
  const { navigation } = porps
  const { state } = navigation
  const { params } = state
  const { title } = params
  return <Text>{title}</Text>
}
```

```js
<Route navigation={navigation} match="home">
  {Home}
</Route>
```

## Elements Render

```js
<Route navigation={navigation} match="some">
  <Text>some</Text>
</Route>
```

## Configuration Render

```js
<Route navigation={navigation} match="some" />
```

And in navigaiton's configuration, you should pass `component` option.

```js
const config = {
  routes: [
    {
      name: 'some',
      patch: '/some',
      component: Some,
      props: { title: 'some' },
    },
  ],
}
```

## render mode priority

Component > Function > Elements > Configuration

## Animation

In most cases, you can use `animation` prop to enable transition between route changes.

```js
<Route navigation={navigation} match="some" animation={600} />
```

When you use `animation` and `component` props together, you should must know that: your component should must support `show` prop, it's the key to make transition work.

```js
<Route navigation={navigation} match="some" animation={600} component={Animation} props={{
  enter: '600 fade:in',
  leave: '600 fade:out',
}}>
  <Text>content</Text>
</Route>
```

We will learn about `Animation` component later. It is use `show` prop to control transition, so is just good enough to use in this case.

## Not in Navigator

You can use `Route` component not in `Navigator`, it is not required. When you do this, you should must pass `navigation` prop.
