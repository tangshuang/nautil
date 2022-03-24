# useModuleNavigator

```js
import { useModuleNavigator } from 'nautil'

export default function Home(props) {
  const navigator = useModuleNavigator()

  return (
    ..
    <Crumbs items={navigator} />
    ..
  )
}

export function navigator(props) {
  ...
}
```
