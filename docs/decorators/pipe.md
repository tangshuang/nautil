# pipe

```js
import { pipe, observe, initialize } from 'nautil'

const operate = pipe([
  observe(subscribe, unsubscribe),
  initialize('i18n', I18nController, { i18n }),
])

const WrappedComponent = operate(OriginalComponent)
```
