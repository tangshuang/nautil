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

const { Outlet, Link, useMatch, useLocation, useParams, useNavigate, useListen } = new Router(config)
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

## Link

```js
import { Link } from 'nautil'
```

A component to create a hyperlink to certain route and display its component.

- to: path of certain route
- replace: boolean, whether replace current router history state
- open: boolean, whether open the target in a new view

```js
<Link to={`detail/${id}`} replace>Detail</Link>
```


## useLocation

```js
import { useLocation } from 'nautil'
```

Get current route context location.

```js
const { pathname, search, hash, query, url } = useLocation()
```

For exmaple, current route is `{ path: 'detail/:id' }`, you may get `pathname=detail/1`.

## useNavigate

```js
import { useNavigate } from 'nautil'
```

```js
const navigate = useNavigate()

navigate(`detail/${id}`, false)
```

```
navigate(to:string, replace:boolean)
```
