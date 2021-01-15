# Consumer

```js
import { Consumer } from 'nautil'

function Some() {
  return (
    <Section>
      <Consumer render={store => {
        ...
      }}>
    </Section>
  )
}
```