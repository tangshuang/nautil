# inject

```js
import { inject } from 'nautil'

const WrappedComponent = inject('now', () => Date.now())(OriginalComponent)
```