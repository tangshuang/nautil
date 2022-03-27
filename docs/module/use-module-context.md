# useModuleContext()

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
