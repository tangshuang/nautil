# Navigator

Navigator is a Nautil component, which is used to create a sepcial section (canvas) based on navigation.

```js
import { Navigator } from 'nautil/components'
```

It has 3 usages:

## Configuration Render

When set `inside` prop, it will read the route.component option on navigation to render, the children will be ignored.

```js
import Home from './pages/home.jsx'
import NotFound from './notFound.jsx'

const navigation = new Navigation({
  routes: [
    {
      name: 'home',
      path: '/home',
      component: Home,
      props: {
        title: 'Home',
      },
      animation: 600,
    },
  ],
  notFound: NotFound,
})
```

```js
<Navigator navigation={navigation} inside />
```

Notice here, we use `inside` prop to open this rendering mode.

## Function Render

Without `inside`, when the children of Navigator is a function, it's output will be used to render.

```js
function Navi(props) {
  const { navigaition } = props
  return <Text>{navigation.status ? navigation.state.name : 'not found'}</Text>
}
```

```js
<Navigator navigation={navigation}>
  {Navi}
</Navigator>
```

## Elements Render

Without `inside` and not function children, it will render as a normal Nautil component.

```js
<Navigator navigation={navigation} dispatch={this.update}>
   <Route match="home" component={Home} />
   <Route match="page1" component={Page1} />
   <Route match="!" component={NotFound} />
</Navigator>
```

Here, I use `Route` to render different route view. In fact, you can use any component to render.

## render mode priority

Configuration > Function > Elements
