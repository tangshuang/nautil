# Textarea

```js
import { Textarea } from 'nautil'

<Textarea value={value} onChange={onChange} />
```

## props

- value: String
- line: Number, textarea row
- placeholder: ifexist(String)
- onChange
- onFocus
- onBlur
- onSelect

`Textarea` support two-way-binding:

```js
<Textarea $value={value} />
```