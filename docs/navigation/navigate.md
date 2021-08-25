# Navigate

Navigate compoent is to use `navigation` instance in an inner component.

```js
import { Navigate } from 'nautil/components'

<Navigate
  navigation={navigation}
  render={navigation =>
    <a href={navigation.makeHref(navigation.state)} onClick={() => navigation.changeLocation(navigation.state)}>click to go</a>
  }
/>
```
