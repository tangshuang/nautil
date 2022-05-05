# createBootstrap

```js
import { createBootstrap } from 'nautil'

const bootstrap = createBootstrap({
  router: {
    mode: '/',
  },
  i18n: {
    // default language name
    language: 'zh-CN',
  },
  // shared this context inside all modules
  context: {},
})

function App() {
  // ...
}

export default bootstrap(App) // -> it returns a ReactComponent
```

Notice that, you should always use `createBootstrap` to bootstrap your application

**options**

- router
  - mode
    - 'memory' or '': default, use memory, when you refresh the browser, you lose the url state
    - 'storage': use Storage, will keep the previous visited url forever when you refresh the browser
    - '/': history mode in browser i.e. /app/page1
    - '#': hash mode in browser, i.e. /uri#/app/page1
    - '?url': search query mode in browser, i.e. /uri?url=/app/page1
    - '#?url': hash search query in browser, i.e. /uri#/some/path?url=/app/page1
- i18n
  - language: initliaze global language
- context: object, which can be get into module components
