# Module

Nautil applications follow a special Module system which split the applications to be modules and which are organized by these modules.

A single Module can be run, preview, debug independently, can be reused in different applications.

In this design, we design a distributed, nested and modular Router system. This Router system is a part of Module system, router code is together with a module not an application. A router can discriminate its position, so you do not need to worry about whether the module is nested in another module.

In this Module system, you should not think about the application, and should think about the module.

## useModuleContext()

```js
import { useModuleContext } from 'nautil'

export default function Home(props) {
  const context = useModuleContext()

  return (
    ..
    <Crumbs items={context.items} />
    ..
  )
}

export function context(props) {
  const [ctx, setCtx] = useState({})
  useEffect(() => {
    ...
    setCtx(data)
  }, [])
  return ctx
}
```

## useModuleI18n

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

## useModuleNavigator

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

## useModuleParams()

```js
import { useModuleParams } from 'nautil'

export default function Home(props) {
  const { id } = useModuleParams()

  return (
    ..
    <Crumbs items={navigator} />
    ..
  )
}

export function params(props) {
  // here, you may use useRouteParams() to get params from route
  return {
    id: '123',
  }
}
```
