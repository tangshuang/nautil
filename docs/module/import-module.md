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

A module is a specific file which exports certain APIs.

```js
// `export navigator` should be a function which is like hook function to return current module's navigator info
// return data should contain `title` and `path`
// - title: current navigator's title
// - path: current navigator's location path, we can navigate to this path by using router
export function navigator(props) {
  const [title, setTitle] = useState('')
  useEffect(() => {
    fetch('xxx').then(res => res.json()).then((data) => {
      setTitle(data.title)
    })
  }, [])
  const { href } = useLocation()

  return {
    title,
    path: href,
  }
}

// `export default` should be a component to be used as view
export default function Home(props) {
  const navigator = useModuleNavigator()

  return (
    ..
    <Crumbs items={navigator} />
    ..
  )
}
```

It will use `Home` as source.
