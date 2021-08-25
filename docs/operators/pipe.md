# pipe

```js
import { pipe, observe, initialize } from 'nautil'

const operate = pipe([
  observe(subscribe, unsubscribe),
  initialize(SomeComponent, { i18n }),
])

const WrappedComponent = operate(OriginalComponent)
```
