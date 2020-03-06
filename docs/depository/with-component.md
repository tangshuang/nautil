# Use with components

How to use depository with components? Follow Observer Pattern!

```js
import { observe, pipe, inject } from 'nautil/operator'
import depo from './depo'

function MyComponent(props) {
  const { depo } = props
  const user = depo.get('user', { id: 10 })

  if (!user) {
    return null
  }

  return (
    <div>{user.name} {user.age}</div>
  )
}

export default pipe([
  inject('depo', depo),
  observe(dispatch => depo.subscribe('user', dispatch), dispatch => depo.unsubscribe('user', dispatch)),
])(MyComponent)
```
