# createAsyncComponent

```js
import { createAsyncComponent } from 'nautil'

const Home = createAsyncComponent(() => import('./home.jsx'))
const Detail = createAsyncComponent(() => import('./detail.jsx'))
```

The imported file should export component as default.
