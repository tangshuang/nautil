# Router

```js
import { Router, Link, useRouteNavigate, useLocation, useHistoryListener, useRouteParams, useRouteMatch, useRouteLocation, useRoutePrefetch, useModuleNavigator, createRouteComponent } from 'nautil'
```

In nautil, you may need `Router` to distribute UI views.

## bootstrap

```js
import { createBootstrap } from 'nautil'

const bootstrap = createBootstrap({
  router: {
    // only mode is needed
    mode: '/',
    // optional
    define: {},
  },
})
```

For a Module it always handle multiple views which is managed by Router. Use `Outlet` to placement at view area. After `History` changed, `Outlet` will give the mathed component view.

Router follows nested rules. For example:

```
'articles' in root router -> /web/articles
  '' in sub router -> /web/articles
  'search' in sub router -> /web/articles/search
  ':id' in sub router -> /web/articles/123
    'edit' in grand router -> /web/articles/123/edit
    'comments/:id' in grand router -> /web/articles/123/comments/456
```

The Router determine current matched path by its nested level, for developers, you should only arrange current module's router, do not need to worry about the whole application's router.

**mode**

`mode` option in `createBootstrap` make sense. It decide the url identification mode. You have 6 modes:

- 'memory' or '': default, use memory, when you refresh the browser, you lose the url state
- 'storage': use Storage, will keep the previous visited url forever when you refresh the browser
- '/': history mode in browser i.e. /app/page1
- '#': hash mode in browser, i.e. /uri#/app/page1
- '?url': search query mode in browser, i.e. /uri?url=/app/page1
- '#?url': hash search query in browser, i.e. /uri#/some/path?url=/app/page1

The last 4 modes support passing base url, for example:

- /web
- #/web
- ?url=/web
- #?url=/web

With this, your application will be visited by `/web/app/page1` which begin with `/web`.

**define**

`define` option in `createBootstrap` define global routes, so that you can use them in `usePermanentNavigate`.

```
define: {
  SOME_ROUTE: '/path/:arg',
}
```

```
const navigate = usePermanentNavigate()
navigate('SOME_ROUTE', { arg })
```

## Router

```js
import { Router } from 'nautil'

const router = new Router({
  routes: [
    {
      path: '',
      component: SomeComponent,
    },
  ],
})
```

**options**

- routes: Array
  - path: string
    - 'some/path' with certain path
    - 'any/:id' with params path
    - '' index path
    - '!' path to fallback when not found
  - component: ReactComponentType
  - redirect: boolean, redirect to when visit this path, if redirect is true, component will not work any more
  - exact: boolean, whether to use the whole url to match current route, if true, only the same url match current route, if false, when the url is begining with path it match the current route
  - params: an object to describe the params mapping
  - props: an object ot describe the props mapping

The routes rules has priority with its order in the given array.

`path` should be relative to current router context, for example `a/b` `some`, notice without `/` or `./` at the beginning.

`exact` always works with '', because all paths is begin with '', so if you want the route exactly match '', set `exact` to be true.

`params` to mapping params to reference component which use `useRouteParams`:

```js
const router = new Router({
  routes: [
    {
      path: 'articles/:id',
      component: SomeComponent,
      params: {
        // id: true, // equal "id: 'id',"
        id: 'articleId',
      }
    }
  ]
})

function SomeComponent() {
  const { articleId } = useRouteParams()
}
```

`props` to mapping props to reference compoent when call `<Outlet>`:

```js
const { Outlet } = new Router({
  routes: [
    {
      path: 'articles/:id',
      component: SomeComponent,
      props: {
        // id: true, // equal "id: 'id',"
        id: 'articleId',
      }
    }
  ]
})

function SomeComponent(props) {
  const { articleId } = props
}

export default function App() {
  return <Outlet id="123" name="xxx" />
}
```

In previous code, we pass `id` `name` to `<Outlet>`, however, the `SomeComponent` will only receive `articleId` which refer to `Outlet.id`.

**Outlet**

A component to display view based on router context.

Which component to display is determined by router's routes, the component will receive props which you pass into `Outlet`.

```js
const { Outlet } = router

export default function App() {
  return <Outlet />
}
```

A Router instance has the followings:

- Outlet
- Link
- useLocation -> useRouteLocation
- useNavigate -> useRouteNavigate
- useParams -> useRouteParams
- useMatch -> useRouteMatch

These APIs will bind the context to the Router, not the placed context.

## Link

```js
import { Link } from 'nautil'
```

A component to create a hyperlink to certain route and display its component.

- to: path of certain route, negative number to go back, positive number to go forward
- replace: boolean, whether replace current router history state
- open: boolean, whether open the target in a new view
- params: path search query to url after to path

```js
<Link to={`detail/${id}`} replace>Detail</Link>
```

**back/forward**

Set `to` to be number, for example -1, 1. `1` to go forward, `-1` to go back.

```js
<Link to={-1}>Back</Link>
```

**cross modules**

`navigate` and `Link` jump amount routes of current router. To jump to another module outside current router, you should pass `/abs/path` as `to`. Begining with `/` and absolute url path will trigger history change with absolute path. Begining with `./` will trigger history change by patch giving path at the current pathname tail.

**change search only**

Set `to` to be `.` and give `params`.

```js
<Link to="." params={{ some: '1' }}>xxx</Link>
```

## useRouteNavigate

```js
import { useRouteNavigate } from 'nautil'
```

```js
const navigate = useRouteNavigate()

navigate(`detail/${id}`, {}, false)
```

```
navigate(to:string, params:object, replace:boolean)
```

To is like `Link` `to` prop.

## useRouteMatch

Give a path or RegExp to check whether it match current route context.

```js
import { useRouteMatch } from 'nautil'

const match = useRouteMatch()
const bool = match('detail', true)
```

```
match(pattern: string | RegExp)
```

## useRouteParams

Get current route context params. However, params are passed by props.

```js
import { useRouteParams } from 'nautil'

const params = useRouteParams()
```

Search query will be parsed into params, for example, when you have a path 'some/:id', and you visit 'some/123?type=edit', the params will be `{ id: 123, type: edit }`.

## useRouteLocation

Give the current route location info.

```js
import { useRouteLocation } from 'nautil'

const { path, abs, route, params } = useRouteLocation()
```

## useRoutePrefetch

Get a prefetch function to prefetch Module source code.

```js
import { useRoutePrefetch } from 'nautil'

const prefetch = useRoutePrefetch()

prefetch(`detail/${id}`) // -> if `detail/:id` provide a Module which is using import() to load code asyncly as component, it will load the script file
```

## useLocation

```js
import { useLocation } from 'nautil'
```

Get current location info.

```js
const { pathname, search, hash, query, href, route } = useLocation()
```

`route` give you the info about router deep path.

## useHistoryListener

Listen to router history change.

```js
import { useHistoryListener } from 'nautil'

useHistoryListener(() => {
  // ...
})
```

## createRouteComponent

In some situation, you need to use routing to control a view but you do not want to create a Router, you can use `createRouteComponent` to control quickly.

```js
const { Outlet } = createRouteComponent('edit', ({ isRouteActive, inactiveRoute }) => {
  return <TdesignModal visible={isRouteActive} onClose={() => inactiveRoute()}>xxx</TdesignModal>;
}, true)
```

When navigate to xxx/edit, `isRouteActive` will be true, so that the Modal is opened, when we invoke `inactiveRoute`, history.back() is invoked in fact, thus `isRouteActive` truns to be false, the Modal is closed.

```
const { Outlet, useActiveRoute, Link, useIsRouteActive } = createRouteComponent(path: string, Component: ComponentType<{ isRouteActive: boolean; inactiveRoute: () => void } & any>, exact?: boolean)
```

Paramters:

- path: string
- Component: ({ isRouteActive, inactiveRoute, routeParams }) => JSX
  - isRouteActive: boolean，detect which match path
  - inactiveRoute: function, invoke to go back
  - routeParams: object, you can use 'some/:id' as path, and receive '{ id }'
- exact: boolean, whether exact match path

Returns:

- Outlet
- useActiveRoute: hook function, return a `activeRoute` function to renavigate to the path, like navigate to, receive `params` and `replace`, dont pass `to`
- Link
- useIsRouteActive: hook function, return a boolean to determine the active status

## createRouteState

In some cases, you want to use route to control some view like state do, `createRouteState` help you to create a state context by route.

```
createRouteState(paths: string[], exact?: boolean)
```

- paths: array of paths
- exact: whether exactly match path


```js
const { useMatch, useParams, useActive, useInactive } = createRouteState(['path1', 'path2'], true)

function MyComponent() {
  const match = useMatch()
  const active = useActive()
  const inactive = useInactive()

  const isPath1 = match('path1')

  const handleJump = () => {
    active('path2')
  }

  const goBack = () => {
    inactive()
  }

  // ...
}
```

In most cases, you use `match` to determine whether the route is navigated to the path.

## Route

A component to create section by route.

```
<Route path render exact />
```

- path: string, the patch to match
- render: params => JSX
- exact: boolean whether to match exactly

Example:

```js
function MyComponent() {
  return (
    <div>
      <Link to="./article/123">article</Link>
      <Route path="" exact render={() => {
        return 'Home'
      }} />
      <Route path="article/:id" render={({ id }) => {
        return id
      }}>
    </div>
  )
}
```

Use `Route` to render section by navigator.

## usePermanentNavigate

Navigate to global route.

```
navigate(routeName: string, params: object, replace: boolean)
```

```js
const navigate = usePermanentNavigate()
navigate('SOME_ROUTE', { arg })
```
