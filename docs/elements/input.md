# Input

```js
import { Input } from 'nautil'

<Input value={value} onChange={onChange} />
```

## props

- type: enumerate(['text', 'number', 'email', 'tel', 'url']) // dont support `date` or `range` right now
- placeholder: ifexist(String)
- value: enumerate([String, Number])
- onChange
- onFocus
- onBlur
- onSelect

`Input` support two-way-binding:

```js
function Some() {
  const value = useState('')

  return <Input $value={value} />
}
```