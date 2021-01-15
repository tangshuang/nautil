# createApp

```js
import { createApp, Navigation, I18n, Store } from 'nautil'

const store = new Store(..)
const navigation = new Navigation(..)
const i18n = new I18n(..)

const App = createApp({ store, navigation, i18n })

<App />
```