# Select

```js
import { Select } from 'nautil'

<Select options={[...]} value={value} onChange={onChange} />
```

## props

- value: Any
- options: List
  - text: String
  - value: Any
  - disabled: ifexist(Boolean)
- placeholder: ifexist(String)
- onChange

`Select` supports two-way-binding:

```js
<Select options={[...]} $value={value} />
```