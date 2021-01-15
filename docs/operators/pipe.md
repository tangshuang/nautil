# pipe

```js
import { pipe, observe, pollute } from 'nautil'

const operate = pipe([
  observe(subscribe, unsubscribe),
  pollute(SomeComponent, { i18n }),
])

const WrappedComponent = operate(OriginalComponent)
```