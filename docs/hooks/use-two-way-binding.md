# useTwoWayBinding

```js
import { useTwoWayBinding } from 'nautil'

function Some(props) {
  const [value, update] = useTwoWayBinding(props.any)
  return <Input $value={[value, update]} />
}
```