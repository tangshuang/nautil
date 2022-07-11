# Module

Nautil applications follow a special Module system which split the applications to be modules and which are organized by these modules.

A single Module can be run, preview, debug independently, can be reused in different applications.

In this design, we design a distributed, nested and modular Router system. This Router system is a part of Module system, router code is together with a module not an application. A router can discriminate its position, so you do not need to worry about whether the module is nested in another module.

In this Module system, you should not think about the application, and should think about the module.

Module = bootstrap + load + navigation + hooks.

- bootstrap: you need to bootstrap an application which use nautil module system
- module loader: you need to use importModule to make a module like a react component
- router: router is a part of module
- module hooks: functions which are react hook functions to prepare (before) for module render

## Bootstrap

You need `createBootstrap` interface to create a bootstrap function, the application should be bootstraped by this function.

```js
// create bootstrap function
const bootstrap = createBootstrap(options)
// use bootstrap to return a Root component
const Root = bootstrap(App)
```

Read more from [createBootstrap](create-bootstrap.md) doc.

## Load

You need `importModule` interface to load a module, module hooks only works with it.

```js
const SomeModule = importModule({
  source: () => import('./some-module.js'),
})

export default App() {
  return <SomeModule />
}
```

Read more from [importModule](import-module.md) doc.

## Navigation

In nautil, navigation is a part of Module, not a independent system, so you should use it in Moulde system.

Read more from [Router](router.md) doc.

## Hooks

A module has its lifecycle, so we expose some hooks which follow react hooks. All hooks are:

- navigator: should return current module's navigator, not all nested navigator
- params: should return the mapping determine object
- context
- i18n
- ready

Each hook is a function which receive one argument as an object:

- props: the props passed by component which exposed by importModule
- i18n: the output of i18n hook
- navigator: the output of navigator hook
- params: the output of params hook
- context: the output of context hook

In the moudle, you can use the following react hook functions to read out results of some mdoule hooks:

- useModuleI18n
- useModuleNavigator
- useModuleParams
- useModuleContext

### useModuleContext()

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

### useModuleI18n

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

### useModuleNavigator

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

### useModuleParams()

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
  // return params mapping object
  return {
    // a string which read from params chain,
    // for example, there is a `id` param in the chain, useModuleParams will use the `id` as `componentId` inside
    companyId: 'id',
    // a string list to determine param value from serval param names in the chain
    user: ['userName', 'user'],
  }
}
```
