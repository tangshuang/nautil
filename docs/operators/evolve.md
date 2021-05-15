# evolve


```js
import { evolve } from 'nautil'

const EvolutionComponent = evolve((props) => {
  const { a, b } = props
  return { a, b }
})(OriginalComponent)
```

In the previous code block, EvolutionComponent will only rerender when the { a, b } is different from previous { a, b }.
