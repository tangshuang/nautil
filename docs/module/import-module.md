# importModule

```js
import { importModule } from 'nautil'

const Home = importModule({
  source: () => import('./home.jsx'),
  pending: (props) => null,
  prefetch: (props) => [
    `/api/detail/${props.id}`,
  ],
})
```

- source: async function which returns a Promise that resolve a ReactComponent
- pending: display before source Promise resolved
- prefetch: prefetch data from server side during source Promise pending/loading component file
- navigator: boolean, whether enable navigator inside
- context: object, share context inside
- ready: boolean, whether enable ready action

A module is a specific file which exports certain APIs.

```js
// `export navigator` should be a function which is like hook function to return current module's navigator info
// return data should contain `title` and `path`
// - title: current navigator's title
// - path: optional, current navigator's location path, we can navigate to this path by using router, if not give, we will use current location href as path by using useLocation
// enabled by `navigator`
export function navigator(props) {
  const [title, setTitle] = useState('')
  useEffect(() => {
    fetch('xxx').then(res => res.json()).then((data) => {
      setTitle(data.title)
    })
  }, [])

  return {
    title,
  }
}

// will be merged with shared context
export function context(props) {
  // should must return an object
  // use hooks here
  // provide context for useModuleContext
  return {}
}

// run before this component initialize
// enabled by `ready`
export function ready(props) {
  // do something when the module ready before the module entry component initialize
  ThisModuleDataService.setBaseUrl('/xxx')

  // should must return true or false
  // return true to tell the module engine to render
  // return false to tell the modole waiting
  return true
}

// `export default` should be a component to be used as view
export default function Home(props) {
  const navigator = useModuleNavigator()
  const context = useModuleContext()

  return (
    ..
    <Crumbs items={navigator} />
    ..
  )
}
```

It will use `Home` as source.
