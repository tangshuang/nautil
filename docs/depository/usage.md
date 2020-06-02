# Usage

```js
import { Depository } from 'nautil'

const dataSource = {
  id: '1',
  url: '/api/v2/xxx',
  method: 'post',
  data: {
    token: window.__token,
  },
}

const depo = new Depository({
  name: 'xxx',
  sources: [
    dataSource,
  ],
})
```
