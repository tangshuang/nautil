# Router

In nautil, you may need `Router` to distribute UI views.

## Usage

```js
import { Router, createBootstrap } from 'nautil'

const bootstrap = createBootstrap({
  router: {
    mode: '/',
  },
  i18n: {},
})

const { Outlet } = new Router(config)
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

## Outlet

A component to display view based on router context.

Which component to display is determined by router's routes, the component will receive props which you pass into `Outlet`.

## Link

```js
import { Link } from 'nautil'
```

A component to create a hyperlink to certain route and display its component.

- to: path of certain route
- replace: boolean, whether replace current router history state
- open: boolean, whether open the target in a new view
- params: path search query to url after to path

```js
<Link to={`detail/${id}`} replace>Detail</Link>
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

## useNavigate

```js
import { useNavigate } from 'nautil'
```

```js
const navigate = useNavigate()

navigate(`detail/${id}`, {}, false)
```

```
navigate(to:string, params:object, replace:boolean)
```

**cross modules**

`navigate` and `Link` jump amount routes of current router. To jump to another module outside current router, you should pass `///abs/path` as `to`. Begining with `///` and absolute url path will trigger history change with absolute path.

## useRouteMatch

Give a path or RegExp to check whether it match current route context.

```js
import { useRouteMatch } from 'nautil'

const match = useRouteMatch()
const bool = match('detail')
```

## useRouteParams

Get current route context params. However, params are passed by props.

```js
import { useRouteParams } from 'nautil'

const params = useRouteParams()
```

## useHistoryListener

Listen to router history change.

```js
import { useHistoryListener } from 'nautil'

useHistoryListener(() => {
  // ...
})
```

## API

A Router instance has the followings:

- Outlet
- Link
- useLocation
- useNavigate
- useListener -> useHistoryListener
- useParams -> useRouteParams
- useMatch -> useHistoryListener
