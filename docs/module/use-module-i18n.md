# useModuleI18n

```js
import { useModuleContext, I18n, useMemo } from 'nautil'

export default function Home(props) {
  const i18n = useModuleI18n()

  return (
    ..
    <span>{i18n.t('some_key')}</span>
    ..
  )
}

export function i18n(props) {
  const i18n = useMemo(() => new I18n({ ... }), [])
  return i18n
}
```
