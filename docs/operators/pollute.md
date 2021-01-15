# pollute

```js
import { pollute } from 'nautil'

const WrappedComponent = pollute(MyComponent, (props) => {
  if (!(i18n in props)) {
    return { i18n: ... }
  }
})(OriginalComponent)
```

`MyComponent` in `WrappedComponent` will be polluted with a prop `i18n`.