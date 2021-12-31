# createBootstrap

```js
import { createBootstrap, LanguageDetector } from 'nautil'

const bootstrap = createBootstrap({
  router: {
    mode: '/',
  },
  i18n: {
    // default language name
    lang: LanguageDetector,
  },
})

function App() {
  // ...
}

export default bootstrap(App) // -> it returns a ReactComponent
```

Notice that, you should always use `createBootstrap` to bootstrap your application
