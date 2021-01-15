# observe

```js
import { observe } from 'nautil'

const WrappedComponent = observe(
  dispatch => store.subscribe(dispatch),
  dispatch => store.unsubscribe(dispatch),
)(OriginalComponent)
```