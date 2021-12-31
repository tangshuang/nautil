# Router API

```js
const { Outlet, Link, useMatch, useLocation, useParams, useNavigate, useListen } = new Router(config)
```

## Outlet

A component to display view based on router context.

Which component to display is determined by router's routes, the component will receive props:

- props you pass into `Outlet`
- params parsed by router, params will be overrided by props

## Link

A component to create a hyperlink to certain route and display its component.

- to: path of certain route
- replace: boolean, whether replace current router history state
- open: boolean, whether open the target in a new view

```js
<Link to={`detail/${id}`} replace>Detail</Link>
```

## useMatch

Give a path or RegExp to check whether it match current route context.

```js
const bool = useMatch('detail')
```

## useLocation

Get current route context location.

```js
const { pathname, search, hash, query, url } = useLocation()
```

For exmaple, current route is `{ path: 'detail/:id' }`, you may get `pathname=detail/1`.

## useParams

Get current route context params. However, params are passed by props.

## useNavigate

```js
const navigate = useNavigate()

navigate(`detail/${id}`, false)
```

```
navigate(to:string, replace:boolean)
```

## useListen

Listen to router history change.

```js
useListen(() => {
  // ...
})
```
