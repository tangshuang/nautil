# T

```js
import { T, Text } from 'nautil'

<T t={key} s={namespace}>default text</T>
<Text t={key} s={namespace} i18n={i18n}>default text</Text>
```

The difference between `T` and `Text` is, you should must pass `i18n` prop into `Text`, `T` will be polluted by `Language`