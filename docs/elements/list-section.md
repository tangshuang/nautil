# ListSection

A composition component which used to render a list.

```js
import { ListSection } from 'nautil'

<ListSection
  data={[...]}
  itemRender={(item) => ...}
  itemKey="id"
  itemStyle={{ ... }}
/>
```

It optimize the implement of list render inside, so you can render a large list once.